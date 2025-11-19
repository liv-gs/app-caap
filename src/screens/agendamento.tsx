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
import { Calendar as RNCalendar, LocaleConfig } from "react-native-calendars";
import { useRoute, RouteProp } from "@react-navigation/native";
import { normalizeService } from "../context/normalizeService";
import type { MainStackParamList } from "../types/types";
import { useAuth } from "../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";


// 🗓️ Configuração do calendário em português
LocaleConfig.locales["pt-br"] = {
  monthNames: [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ],
  monthNamesShort: [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ],
  dayNames: [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
  ],
  dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
  today: "Hoje",
};
LocaleConfig.defaultLocale = "pt-br";

type RouteParams = RouteProp<MainStackParamList, "agendamento">;

export default function Calendar() {
  const navigation = useNavigation();
  const route = useRoute<RouteParams>();
  const { usuario } = useAuth();
  const service = normalizeService(route.params.service);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedHorario, setSelectedHorario] = useState<string | null>(null);
  const [events, setEvents] = useState<Record<string, any>>({});
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [diasSelecionados, setDiasSelecionados] = useState<string[]>([]);

  const horariosDisponiveis = service.horarios || [];
  const diasPermitidos = service.dias || [];

  // Data mínima = hoje
  const hoje = new Date();
  const minDate = hoje.toISOString().split("T")[0];

  // Converte "YYYY-MM-DD" em objeto Date local
  function parseDateLocal(dateString: string) {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  function formatKey(date: Date) {
    return date.toISOString().split("T")[0];
  }

  async function buscarAgendamentos() {
    try {
      const res = await fetch(
        `https://caapi.org.br/wp-json/agendamento/v1/listar?servico_id=${service.id}`,
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
        const partes = ag.data.split("-");
        if (partes.length === 3) {
          const [dia, mes, ano] = partes.map(Number);
          const key = `${ano}-${String(mes).padStart(2, "0")}-${String(
            dia
          ).padStart(2, "0")}`;
          const horariosExistentes = formatted[key]?.horarios ?? [];
          formatted[key] = {
            horarios: [...horariosExistentes, ag.hora],
            ocupado: false,
          };
        }
      });

      // Marca dia como ocupado se todos os horários estiverem preenchidos
      Object.keys(formatted).forEach((key) => {
        const totalHorarios = horariosDisponiveis.length;
        formatted[key].ocupado =
          service.diaria || formatted[key].horarios.length >= totalHorarios;
      });

      setEvents(formatted);
    } catch (err) {
      console.error("Erro ao buscar agendamentos", err);
    }
  }

  async function confirmarAgendamento() {
    if (!selectedDate) return;

    const dia = selectedDate;
    const dataFormatada = `${String(dia.getDate()).padStart(2, "0")}-${String(
      dia.getMonth() + 1
    ).padStart(2, "0")}-${dia.getFullYear()}`;

    const key = formatKey(selectedDate);

    if (!service.diaria && selectedHorario) {
      const ocupado =
        events[key]?.horarios.includes(selectedHorario) || false;
      if (ocupado) {
        Alert.alert("Indisponível", "Este horário já foi ocupado.");
        return;
      }
    } else if (service.diaria && events[key]?.ocupado) {
      Alert.alert("Indisponível", "Este dia já foi ocupado.");
      return;
    }

    try {
      const payload = {
        data: dataFormatada,
        hora: service.diaria ? "DIARIA" : selectedHorario,
        usuario,
        servico_id: service.id,
      };

      const res = await fetch(
        "https://caapi.org.br/wp-json/agendamento/v1/cadastrar",
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
        const errText = await res.text();
        let errObj;
        try {
          errObj = JSON.parse(errText);
        } catch {
          throw new Error(errText);
        }

        if (errObj?.code === "ja_ocupado") {
          Alert.alert(
            "Indisponível",
            service.diaria
              ? "Este dia já foi ocupado."
              : "Este horário já foi ocupado."
          );
          await buscarAgendamentos();
          return;
        }
        throw new Error(errText);
      }

      await res.json();
      Alert.alert("Sucesso", "Agendamento realizado com sucesso!");
      await buscarAgendamentos();
      setConfirmVisible(false);
    } catch (e: any) {
      console.error("Erro ao agendar", e);
      Alert.alert("Erro inesperado", "Não foi possível cadastrar o agendamento.");
    }
  }

  useEffect(() => {
    buscarAgendamentos();
  }, []);

  

  // 🟢 Gera marcações do calendário
  type MarkedDate = {
  marked?: boolean;
  dotColor?: string;
  selected?: boolean;
  selectedColor?: string;
};

const markedDates: Record<string, MarkedDate> = Object.fromEntries(
  Array.from({ length: 60 }).map((_, i) => {
    const data = new Date();
    data.setDate(hoje.getDate() + i);
    const key = data.toISOString().split("T")[0];
    const diaSemana = data.getDay();

    const permitido = diasPermitidos.includes(diaSemana);
    const evento = events[key];
    let dotColor = undefined;
    let marked = false;

    if (permitido) {
      if (service.diaria) {
        dotColor = evento?.ocupado ? "#FF6B6B" : "#4CAF50";
      } else {
        const totalHorarios = horariosDisponiveis.length;
        const ocupados = evento?.horarios.length || 0;
        dotColor =
          ocupados === totalHorarios && totalHorarios > 0
            ? "#FF6B6B"
            : "#4CAF50";
      }
      marked = true;
    }

    return [key, { marked, dotColor }];
  })
);

      if (service.diaria && diasSelecionados.length > 0) {
        diasSelecionados.forEach((d) => {
          if (markedDates[d]) {
            markedDates[d].selected = true;
            markedDates[d].selectedColor = "#1D75CD";
          } else {
            // caso o dia ainda não esteja no array de 60 dias
            markedDates[d] = {
              selected: true,
              selectedColor: "#1D75CD",
            };
          }
        });
      }






  return (
    <View style={styles.container}>
      {/* Botão de Voltar */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#0D3B66" />
        </TouchableOpacity>

      <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: "700", color: "#0D3B66" }}>
          Agendamento: {service.title}
        </Text>

        {/* 🕓 Informações de disponibilidade */}
        <Text style={{ marginTop: 6, color: "#555", fontSize: 15 }}>
          Dias disponíveis:{" "}
          {diasPermitidos
            .map(
              (d) =>
                ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"][
                  d
                ]
            )
            .join(", ")}
        </Text>
        {!service.diaria && (
          <Text style={{ color: "#555", fontSize: 15 }}>
            Horários: {horariosDisponiveis.join(", ")}
          </Text>
        )}
      </View>

      {/* 🗓️ Calendário */}
      <RNCalendar
        minDate={minDate}
        markedDates={markedDates}
        onDayPress={async (day) => {
          const date = parseDateLocal(day.dateString);
          const diaSemana = date.getDay();

          if (!diasPermitidos.includes(diaSemana)) {
            Alert.alert("Indisponível", "Este dia não está disponível para agendamento.");
            return;
          }

          await buscarAgendamentos();

          // 🔴 Se for diária e o dia já estiver ocupado, bloqueia
          if (service.diaria && events[day.dateString]?.ocupado) {
            Alert.alert("Indisponível", "Este dia já foi reservado.");
            return;
          }

          // 🟢 Se for diária, acumula dias
          if (service.diaria) {
            setDiasSelecionados((prev) => {
              // Evita duplicatas
              if (prev.includes(day.dateString)) return prev;
              return [...prev, day.dateString];
            });
            setSelectedDate(date);
            setConfirmVisible(true);
          } else {
            // fluxo normal (por horário)
            setSelectedDate(date);
            setSelectedHorario(null);
            setConfirmVisible(true);
          }
        }}

        theme={{
          textMonthFontWeight: "700",
          todayTextColor: "#0D3B66",
          arrowColor: "#0D3B66",
        }}
      />
     {service.diaria ? (
      // 🟢 Legenda para serviços diários
      <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 20 }}>
        <View style={{ flexDirection: "row", alignItems: "center", marginHorizontal: 10 }}>
          <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: "#4CAF50", marginRight: 6 }} />
          <Text style={{ color: "#555" }}>Dias disponíveis</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", marginHorizontal: 10 }}>
          <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: "#FF6B6B", marginRight: 6 }} />
          <Text style={{ color: "#555" }}>Dias ocupados</Text>
        </View>
      </View>
    ) : (
      // 🕓 Legenda para serviços com horários
      <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 20 }}>
        <View style={{ flexDirection: "row", alignItems: "center", marginHorizontal: 10 }}>
          <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: "#4CAF50", marginRight: 6 }} />
          <Text style={{ color: "#555" }}>Possui horários disponíveis</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", marginHorizontal: 10 }}>
          <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: "#FF6B6B", marginRight: 6 }} />
          <Text style={{ color: "#555" }}>Totalmente ocupado</Text>
        </View>
      </View>
    )}



      {/* 💬 Modal de confirmação */}
      <Modal visible={confirmVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
                {service.diaria ? "Selecionar dias" : "Confirmar agendamento"}
              </Text>

              {service.diaria ? (
                <>
                  {/* Lista os dias selecionados */}
                  {diasSelecionados.length > 0 ? (
                    diasSelecionados.map((d) => (
                      <Text key={d} style={styles.dateText}>
                        {new Date(d).toLocaleDateString("pt-BR")}
                      </Text>
                    ))
                  ) : (
                    <Text style={styles.dateText}>Nenhum dia selecionado</Text>
                  )}

                  {/* Botão para adicionar outro dia */}
                  <TouchableOpacity
                    style={[styles.confirmBtn, { backgroundColor: "#1D75CD" }]}
                    onPress={() => {
                      setConfirmVisible(false);
                      Alert.alert("Selecione outro dia no calendário.");
                    }}
                  >
                    <Text style={styles.confirmBtnText}>Adicionar mais dias</Text>
                  </TouchableOpacity>

                  {/* Botão para confirmar todos os dias */}
                  {diasSelecionados.length > 0 && (
                    <TouchableOpacity
                      onPress={async () => {
                        try {
                          for (const d of diasSelecionados) {
                            const diaObj = parseDateLocal(d);
                            const dataFormatada = `${String(diaObj.getDate()).padStart(2, "0")}-${String(
                              diaObj.getMonth() + 1
                            ).padStart(2, "0")}-${diaObj.getFullYear()}`;

                            const payload = {
                              data: dataFormatada,
                              hora: "DIARIA",
                              usuario,
                              servico_id: service.id,
                            };

                            const res = await fetch(
                              "https://caapi.org.br/wp-json/agendamento/v1/cadastrar",
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
                              const errText = await res.text();
                              console.error("Erro ao agendar:", errText);
                            }
                          }

                          Alert.alert("Sucesso", "Dias confirmados com sucesso!");
                          setDiasSelecionados([]);
                          setConfirmVisible(false);
                          await buscarAgendamentos();
                        } catch (e) {
                          Alert.alert("Erro", "Não foi possível confirmar os dias.");
                        }
                      }}
                      style={styles.confirmBtn}
                    >
                      <Text style={styles.confirmBtnText}>Confirmar</Text>
                    </TouchableOpacity>
                  )}
                </>
              ) : (
                <>
                  {/* fluxo normal de horários */}
                  <Text style={styles.dateText}>
                    {selectedDate?.toLocaleDateString("pt-BR")}
                    {selectedHorario ? ` às ${selectedHorario}` : ""}
                  </Text>

                  {!service.diaria && selectedDate && (
                    <FlatList
                      data={horariosDisponiveis}
                      keyExtractor={(item) => item}
                      renderItem={({ item }) => {
                        const ocupado =
                          events[formatKey(selectedDate!)]?.horarios.includes(item) || false;

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
                                ocupado && { color: "#C0392B", fontWeight: "700" },
                              ]}
                            >
                              {item}
                            </Text>
                          </TouchableOpacity>
                        );
                      }}
                    />
                  )}

                  {selectedDate && selectedHorario && (
                    <TouchableOpacity
                      onPress={confirmarAgendamento}
                      style={styles.confirmBtn}
                    >
                      <Text style={styles.confirmBtnText}>Confirmar</Text>
                    </TouchableOpacity>
                  )}
                </>
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
  container: { flex: 1, backgroundColor: "#FFF", paddingTop: 150 },

  backButton: {
  left: 20,
  zIndex: 10,
  bottom:20,
  backgroundColor: "rgba(255,255,255,0.9)",
 
},

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
  horarioBtnAvailable: {
    backgroundColor: "#E8F6F3",
    borderColor: "#A8E6CF",
  },
  horarioBtnDisabled: {
    backgroundColor: "#FFE0E0",
    borderColor: "#FF6B6B",
  },
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
