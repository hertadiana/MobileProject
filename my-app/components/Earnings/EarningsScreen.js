import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";
import React, { useCallback, useState } from "react";
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const initializeDB = async (db) => {
  try {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS earningsTable (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        type TEXT NOT NULL,
        sum INTEGER NOT NULL,
        date TEXT NOT NULL,
        mentions TEXT
      );
    `);
    console.log("Table created");
  } catch (error) {
    console.error("Error in initializing DB and inserting data:", error);
  }
};

export default function Earnings() {
  return (
    <SQLiteProvider databaseName="MoneyDB.db" onInit={initializeDB}>
      <EarningList />
    </SQLiteProvider>
  );
}

export function EarningList() {
  const db = useSQLiteContext();
  const [earnings, setEarnings] = useState([]);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(()=>{
        (async () => {
            await fetchEarnings()
        })();
    }, [])
  )

  async function fetchEarnings(){
    const result= await db.getAllAsync("SELECT * FROM earningsTable")
    setEarnings(result)
    console.log("earning:",result)
  }
//   useEffect(() => {
//     const fetchEarnings = async () => {
//       try {
//         const result = await db.getAllAsync("SELECT * FROM earningsTable");
//         setEarnings(result);
//         console.log("Earnings fetched:", result);
//       } catch (error) {
//         console.error("Error fetching earnings:", error);
//       }
//     };

//     fetchEarnings();
//   }, [db]);

  const renderEarning = ({ item }) => (
    <View style={styles.earningItem}>
      <Text style={styles.text}>Type: {item.type}</Text>
      <Text style={styles.text}>Sum: ${item.sum}</Text>
      <Text style={styles.text}>Date: {item.date}</Text>
      <Text style={styles.text}>Mentions: {item.mentions}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={earnings}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderEarning}
        contentContainerStyle={{ paddingBottom: 80 }} // Adds padding to avoid overlap with floating button
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddEarning")}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f8f9fa",
  },
  earningItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#fff",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  text: {
    fontSize: 16,
    marginBottom: 3,
  },
  addButton: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    borderRadius: 50,
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    backgroundColor: "#007bff",
    elevation: 5,
  },
  addButtonText: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
  },
});
