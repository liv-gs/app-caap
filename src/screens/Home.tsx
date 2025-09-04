import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import ButtonSvg from '../../assets/images/button.svg';
import ButtonSvg2 from '../../assets/images/button2.svg';
import ButtonSvg3 from '../../assets/images/button3.svg';
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useEffect, useState } from "react";



// tipo para notícia
type NewsType = {
  id: string;
  tag: string;
  tagColor: string;
  title: string;
  createdAt: string;
};


type NewsItemProps = {
  tag: string;
  tagColor: string;
  title: string;
};

function NewsItem({ tag, tagColor, title }: NewsItemProps) {
  return (
    <View style={styles.newsItem}>
      <View style={styles.newsImagePlaceholder} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.newsTag, { color: tagColor }]}>{tag}</Text>
        <Text style={styles.newsTitle}>{title}</Text>
      </View>
    </View>
  );
}



type BannerCardProps = {
  title: string;
  onPress: () => void;
  Background: React.ComponentType<any>; // componente SVG
};


//SERVICE






//BANNER

function BannerCard({ title, onPress, Background }: BannerCardProps) {
  return (
    <View style={styles.newContainerBanner}>
        <TouchableOpacity style={styles.containerBanner} onPress={onPress}>
      {/* Fundo dinâmico */}
      <Background
      width="110%"      // aumentar para “dar zoom”
      height="110%"     // aumentar para cobrir verticalmente também
      preserveAspectRatio="xMidYMid slice"
      style={{ position: "absolute", top: "-5%", left: "-5%" }}
      />

      {/* Conteúdo por cima */}
      <View style={styles.contentBanner}>
        <Text style={styles.titleBanner}>{title}</Text>
        <View style={styles.buttonBanner}>
          <Text style={styles.buttonTextBanner}>Veja mais</Text>
        </View>
      </View>
    </TouchableOpacity>

    </View>
  
  );
}





//NOTICIAS





export default function Home() {
  const [news, setNews] = useState<NewsType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      fetch("https://sites-caapi.mpsip8.easypanel.host/wp-json/wp/v2/posts") // sua API WordPress
        .then((res) => res.json())
        .then((data: any[]) => {
          // Mapeia os dados para o formato correto
          const mapped: NewsType[] = data.map(item => ({
            id: item.id.toString(),
            tag: "COMUNICADO", // você pode ajustar a lógica para tags reais
            tagColor: "#D4A017", // ajuste conforme a tag
            title: item.title.rendered,
            createdAt: item.date, // para ordenação
          }));

          // Ordena por data decrescente (mais recente primeiro)
          const sortedNews = mapped.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

          // Pega apenas as 3 primeiras
          setNews(sortedNews.slice(0, 3));
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }, []);


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
    <ScrollView   contentContainerStyle={{ padding: 20, paddingTop:100,}}
    showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.row}>
          <Image
            source={{ uri: "https://placehold.co/60x60" }} // 👉 aqui coloca sua foto
            style={styles.avatar}
          />
          <View>
            <Text style={styles.welcome}>Olá, Dr. João Silva</Text>
            <Text style={styles.subtext}>OAB/PI 12345 · Bem-vindo de volta!</Text>
          </View>
        </View>
        <TouchableOpacity>
          <Ionicons name="notifications" size={22} color="#0D3B66" /> 
          {/* 👉 aqui troca pelo sininho que você tem */}
        </TouchableOpacity>
      </View>

      {/* Carteira Digital */}
      <View style={styles.card}>
        <View style={styles.row}>
           <View style={[styles.iconPlaceholdercard, { backgroundColor: "#DCFCE7" }]}>
             <FontAwesome name="id-card" size={20} color="#16A34A" />
          </View>

          
          <View>
            <Text style={styles.cardTitle}>Carteira Digital</Text>
            <Text style={styles.cardStatus}>✓ Anuidade em dia</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Ver Carteira</Text>
        </TouchableOpacity>
      </View>






    
      {/* Ações Rápidas */}

    <Text style={styles.sectionTitle}>Ações Rápidas</Text>
    <View style={styles.grid}>
      <TouchableOpacity style={styles.gridItem}>
        <View style={styles.gridIconText}>
          <View style={styles.iconWrapper}>
            <FontAwesome5 name="file-invoice" size={20} color="#10567C" />
          </View>
          <Text style={styles.gridText}>2ª Via Boleto</Text>
        </View>
      </TouchableOpacity>


      <TouchableOpacity style={styles.gridItem}>
        <View style={styles.gridIconText}>
          <View style={styles.iconWrapper}>
          <MaterialIcons name="hotel" size={22} color="#10567C" />
          </View>
          <Text style={styles.gridText}>Reservar Pousada</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.gridItem}>
        <View style={styles.gridIconText}>
            <View style={styles.iconWrapper}>
              <FontAwesome name="handshake-o" size={20} color="#10567C"/>
          </View>
          <Text style={styles.gridText}>Convênios</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.gridItem}>
        <View style={styles.gridIconText}>
            <View style={styles.iconWrapper}>
              <FontAwesome name="stethoscope" size={22} color="#10567C" />
          </View>
          <Text style={styles.gridText}>Serviços</Text>
        </View>
      </TouchableOpacity>
    </View>





      
  <Text style={styles.sectionTitle}>Serviços</Text>
<View style={styles.serviceItem}>
  <View style={styles.row}>
    <View style={[styles.iconPlaceholder, { backgroundColor: "#DBEAFE" }]}>
      < FontAwesome5 name="user-md" size={18} color="#1E3A8A" />

    </View>
    <View style={{ flex: 1, marginLeft: 12 }}>
      <Text style={styles.serviceTitle}>Atendimento INSS</Text>
      <Text style={styles.serviceSubtitle}>Orientação previdenciária</Text>
    </View>
    <TouchableOpacity>
      <Text style={styles.serviceAction}>Agendar</Text>
    </TouchableOpacity>
  </View>
</View>
<View style={styles.serviceItem}>
  <View style={styles.row}>
    <View style={[styles.iconPlaceholder, { backgroundColor: "#DCFCE7" }]}>
     <FontAwesome6 name="brain" size={18} color="#16A34A" />
    </View>
    <View style={{ flex: 1, marginLeft: 12 }}>
      <Text style={styles.serviceTitle}>Atendimento Psicológico</Text>
      <Text style={styles.serviceSubtitle}>Psicologia Viva</Text>
    </View>
    <TouchableOpacity>
      <Text style={styles.serviceAction}>Acessar</Text>
    </TouchableOpacity>
  </View>
</View>
<View style={styles.serviceItem}>
  <View style={styles.row}>
    <View style={[styles.iconPlaceholder, { backgroundColor: "#FEF9C3" }]}>
      <FontAwesome name="certificate" size={18} color="#CA8A04" />
    </View>
    <View style={{ flex: 1, marginLeft: 12 }}>
      <Text style={styles.serviceTitle}>Certificado Digital</Text>
      <Text style={styles.serviceSubtitle}>Emissão e renovação</Text>
    </View>
    <TouchableOpacity>
      <Text style={styles.serviceAction}>Solicitar</Text>
    </TouchableOpacity>
  </View>
</View>






     {/* Banners */}
    <BannerCard
      title="Convênios"
      Background={ButtonSvg}
      onPress={() => console.log("Convênios")}
    />

    <BannerCard
      title="Minha Caapi"
      Background={ButtonSvg2}
      onPress={() => console.log("Minha Caapi")}
    />

    <BannerCard
      title="Serviços"
      Background={ButtonSvg3}
      onPress={() => console.log("Serviços")}
    />


    {/* Notícias dinâmicas */}
      <View style={styles.newsContainer}>
        <Text style={styles.sectionTitle}>Notícias</Text>
        {loading ? (
          <Text>Carregando notícias...</Text>
        ) : (
          news.map((item) => (
            <NewsItem
              key={item.id}       // key separada, não precisa passar como prop
              tag={item.tag}
              tagColor={item.tagColor}
              title={item.title}  // já é string
            />
          ))
        )}
      </View>



    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffffff", },
  row: { flexDirection: "row", alignItems: "center", },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 12 },
  welcome: { fontSize: 18, fontWeight: "bold", color: "#0D3B66" },
  subtext: { fontSize: 14, color: "#666" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: "600", color: "#0D3B66" },

    iconPlaceholdercard: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cardStatus: { fontSize: 14, color: "green" },
  button: {
    backgroundColor: "#0D3B66",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  buttonText: { color: "#fff", fontWeight: "600" },

  //acoes rapidas, serviços, noticias titulo
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12, color: "#0D3B66", paddingTop:25,paddingBottom:6, },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    

    //Ações rapidas 
  },
  gridItem: {
  backgroundColor: "#fff",
  width: "48%",
  height: 120,          // altura do card
  borderRadius: 16,
  padding: 8,
  marginBottom: 14,
  shadowColor: "#000",
  shadowOpacity: 0.05,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 4,
  elevation: 2,
  position: "relative",  // necessário pro absolute
  },
gridIconText: {
  position: "absolute",
  top: 8,
  left: 8,              // canto superior esquerdo
  alignItems: "flex-start",  // mantém o texto abaixo do ícone, alinhado à esquerda
  flexShrink: 0,        // impede que o texto quebre
  width: undefined,       // deixa o texto usar sua largura natural
},

gridText: {
  marginTop: 4,
  fontSize: 14,
  fontWeight: "500",
  textAlign: "left",     // alinhamento à esquerda
  flexShrink: 0,          // impede quebra de linha
  color:'#53555A',
},
iconWrapper: {
  width: 48,                // largura da caixa
  height: 48,               // altura da caixa
  justifyContent: "center",
  alignItems: "center",
  borderWidth: 1,           // borda da caixa
  borderColor: "#E5E7EB",  // cor da borda
  borderRadius: 8,          // cantos arredondados
  backgroundColor: "#E5E7EB",  // fundo da caixa, opcional
  marginBottom: 4,          // espaçamento entre a caixa e o texto
},







  //SERVICE
  serviceItem: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  
  },
  iconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  serviceTitle: { fontSize: 15, fontWeight: "600", color: "#0D3B66" },
  serviceSubtitle: { fontSize: 13, color: "#666" },
  serviceAction: { color: "#0D3B66", fontWeight: "bold", fontSize: 14 },


  newsContainer: { marginTop: 20, },
  newsItem: {
    flexDirection: "row",
    marginBottom: 18,
    alignItems: "flex-start",
  },
  newsImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: "#EAF0F6", // 👉 Aqui depois você substitui pela imagem real
    marginRight: 12,
  },
  newsTag: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 4,
  },
  newsTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0D3B66",
    lineHeight: 20,
  },



  
  //BANNER
  newContainerBanner:{
    paddingTop:20

  },
    containerBanner: {
    width: "100%",
    height: 100, // menor como no print
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 1,
    position: "relative",
  
  },
  contentBanner: { // 👈 antes estava como "content"
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 25,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleBanner: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  buttonBanner: {
    backgroundColor: "#245EA8",
    borderRadius: 15,
    paddingVertical: 17,
    paddingHorizontal: 25,
  },
  buttonTextBanner: {
    color: "#fff",
    fontWeight: "600",
  },

  
});
