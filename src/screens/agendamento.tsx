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

type Usuario = {
  idUsuarioLogado: number;
  nomeLogado: string;
  email: string;
  cpf: string;
  foto: string;
  validado: number;
  oab: string;
  celular: string;
  tipo: string;
  primeiroAcesso?: string | null;
  dataNascimento: string;
  validadeCarteira: string;
  endereco: any;
  hash: string;
  titular?: string | null;
};

type Props = {
  service: { id: number; tipo: string };
  usuarioLogado: Usuario;
};

export default function Calendar({ service, usuarioLogado }: Props) {
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedHorario, setSelectedHorario] = useState<string | null>(null);
  const [events, setEvents] = useState<Record<string, any>>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

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
        formatted[ag.data_iso] = {
          ocupado: true,
          horarios: [...(formatted[ag.data_iso]?.horarios ?? []), ag.hora],
        };
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
        hora: service.tipo === "hotel" ? "DIARIA" : selectedHorario,
        usuario: usuarioLogado,
        servico_id: service.id,
      };

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

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }

      Alert.alert("Sucesso", "Agendamento realizado com sucesso!");

      // Atualiza calendário local
      setEvents((prev) => ({
        ...prev,
        [formatKey(selectedDate)]: {
          ocupado: true,
          horarios: [
            ...(prev[formatKey(selectedDate)]?.horarios ?? []),
            payload.hora,
          ],
        },
      }));

      setConfirmVisible(false);
      setModalVisible(false);
    } catch (e: any) {
      console.error("Erro ao agendar", e);
      Alert.alert("Erro", "Não foi possível cadastrar o agendamento.");
    }
  }

  useEffect(() => {
    buscarAgendamentos();
  }, []);

  const horariosDisponiveis = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "14:00",
    "15:00",
    "16:00",
  ];

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
          setSelectedDate(date);
          setModalVisible(true);
        }}
      />

      {/* Modal para escolher horário */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Selecione um horário para {selectedDate?.toLocaleDateString()}
            </Text>

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
                    ]}
                    disabled={ocupado}
                    onPress={() => {
                      setSelectedHorario(item);
                      setConfirmVisible(true);
                    }}
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

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.cancelBtnModal}
            >
              <Text style={styles.cancelBtnTextModal}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de confirmação */}
      <Modal visible={confirmVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmar agendamento?</Text>
            <Text style={styles.dateText}>
              {selectedDate?.toLocaleDateString()} às {selectedHorario}
            </Text>

            <TouchableOpacity
              onPress={confirmarAgendamento}
              style={styles.confirmBtn}
            >
              <Text style={styles.confirmBtnText}>Confirmar</Text>
            </TouchableOpacity>

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
  container: { flex: 1, backgroundColor: "#FFF" },
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
  cancelBtnModal: {
    backgroundColor: "#E74C3C",
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 12,
    alignItems: "center",
  },
  cancelBtnTextModal: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
