import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  Alert,
  StyleSheet,
} from "react-native";
import { Calendar as RNCalendar } from "react-native-calendars";
import { useRoute, RouteProp } from "@react-navigation/native";
import { normalizeService } from "../context/normalizeService";
import type { MainStackParamList } from "../types/types";
import { useAuth } from "../context/AuthContext";

type RouteParams = RouteProp<MainStackParamList, "agendamento">;

export default function Calendar() {
  const route = useRoute<RouteParams>();
  const { usuario } = useAuth();
  const service = normalizeService(route.params.service);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedHorario, setSelectedHorario] = useState<string | null>(null);
  const [events, setEvents] = useState<Record<string, any>>({});
  const [confirmVisible, setConfirmVisible] = useState(false);

  const horariosDisponiveis = service.horarios || [];
  const diasPermitidos = service.dias || [];

  function formatKey(date: Date) {
    return date.toISOString().split("T")[0];
  }

async function buscarAgendamentos() {
  try {
    const res = await fetch(
      `https://sites-caapi.mpsip8.easypanel.host/wp-json/agendamento/v1/listar?servico_id=${service.id}`,
      {
        headers: {
          Authorization:
            "Basic YXBpYXBwOkw2SkcgMmtoTSBLamk5IHA3WUwgbHY0MiBMQXdM",
        },
      }
    );

    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();

    const formatted: Record<string, any> = {};

    data.forEach((ag: any) => {
      const key = ag.data_iso;
      const horariosExistentes = formatted[key]?.horarios ?? [];
      formatted[key] = {
        horarios: [...horariosExistentes, ag.hora],
        ocupado: false, // inicialmente falso
      };
    });

    // Marca o dia como ocupado se todos os horários estiverem preenchidos
    Object.keys(formatted).forEach((key) => {
      const totalHorarios = horariosDisponiveis.length;
      formatted[key].ocupado = formatted[key].horarios.length >= totalHorarios;
    });

    setEvents(formatted);
  } catch (err) {
    console.error("Erro ao buscar agendamentos", err);
  }
}


  async function confirmarAgendamento() {
    if (!selectedDate) return;

    try {
      const dia = selectedDate;
      const dataFormatada = `${String(dia.getDate()).padStart(2, "0")}-${String(
        dia.getMonth() + 1
      ).padStart(2, "0")}-${dia.getFullYear()}`;

      const payload = {
        data: dataFormatada,
        hora: service.diaria ? "DIARIA" : selectedHorario,
        usuario,
        servico_id: service.id,
      };

      console.log("📤 Payload enviado:", payload);

      const res = await fetch(
        "https://sites-caapi.mpsip8.easypanel.host/wp-json/agendamento/v1/cadastrar",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Basic YXBpYXBwOkw2SkcgMmtoTSBLamk5IHA3WUwgbHY0MiBMQXdM",
          },
          body: JSON.stringify(payload),
        }
      );

      console.log("📥 Status da resposta:", res.status);

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }

      const data = await res.json();
      console.log("✅ Resposta da API:", data);

      Alert.alert("Sucesso", "Agendamento realizado com sucesso!");
      await buscarAgendamentos();
      setConfirmVisible(false);
    } catch (e: any) {
      console.error("Erro ao agendar", e);
      Alert.alert("Erro", "Não foi possível cadastrar o agendamento.");
    }
  }

  useEffect(() => {
    buscarAgendamentos();
  }, []);

  return (
    <View style={styles.container}>
      <RNCalendar
        markedDates={Object.fromEntries(
          Object.keys(events).map((date) => [
            date,
            {
              marked: true,
              dotColor: events[date].ocupado ? "red" : "green",
            },
          ])
        )}
        onDayPress={(day) => {
      const date = new Date(day.dateString);
      const diaSemana = date.getDay();

      if (!diasPermitidos.includes(diaSemana)) {
        Alert.alert("Indisponível", "Este dia não está disponível para agendamento.");
        return;
      }

      setSelectedDate(date);

      if (service.diaria) {
        setSelectedHorario("DIARIA"); // <-- garante que a condição fique true
      } else {
        setSelectedHorario(null);
      }

      console.log("Diária?", service.diaria, "Data selecionada:", date);
      setConfirmVisible(true);
    }}

      />

      {/* Modal único de confirmação */}
      <Modal visible={confirmVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmar agendamento</Text>

            <Text style={styles.dateText}>
              {selectedDate?.toLocaleDateString()}
              {service.diaria
                ? ""
                : selectedHorario
                ? ` às ${selectedHorario}`
                : ""}
            </Text>

            {/* Se NÃO for diária → lista de horários */}
            {!service.diaria && selectedDate && (
              <FlatList
                data={horariosDisponiveis}
                keyExtractor={(item) => item}
                renderItem={({ item }) => {
                  const ocupado =
                    events[formatKey(selectedDate!)]?.horarios.includes(item);

                  return (
                    <TouchableOpacity
                      style={[
                        styles.horarioBtn,
                        ocupado
                          ? styles.horarioBtnDisabled
                          : styles.horarioBtnAvailable,
                        selectedHorario === item && {
                          borderColor: "#0D3B66",
                          borderWidth: 2,
                        },
                      ]}
                      disabled={ocupado}
                      onPress={() => setSelectedHorario(item)}
                    >
                      <Text
                        style={[
                          styles.horarioBtnText,
                          ocupado && { color: "#888" },
                        ]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />
            )}

            {/* Botão confirmar só aparece se já tem data e (se necessário) horário */}
            {selectedDate && (service.diaria || selectedHorario) && (
              <TouchableOpacity onPress={confirmarAgendamento} style={styles.confirmBtn}>
                <Text style={styles.confirmBtnText}>Confirmar</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => setConfirmVisible(false)}
              style={styles.cancelBtn}
            >
              <Text style={styles.cancelBtnText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF", paddingTop:100, },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.45)",
    paddingHorizontal: 16,
  },
  modalContent: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 14,
    maxHeight: "85%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0D3B66",
    textAlign: "center",
    marginBottom: 12,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 16,
  },
  horarioBtn: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginVertical: 6,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E6E6E6",
  },
  horarioBtnText: { fontSize: 16, fontWeight: "600", color: "#0D3B66" },
  horarioBtnAvailable: { backgroundColor: "#E8F6F3", borderColor: "#A8E6CF" },
  horarioBtnDisabled: { backgroundColor: "#F3F3F3", borderColor: "#DDD" },
  confirmBtn: {
    backgroundColor: "#0D3B66",
    paddingVertical: 14,
    borderRadius: 12,
    marginVertical: 6,
    alignItems: "center",
  },
  confirmBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  cancelBtn: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    borderRadius: 12,
    marginVertical: 6,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E74C3C",
  },
  cancelBtnText: { color: "#E74C3C", fontWeight: "700", fontSize: 16 },
});
