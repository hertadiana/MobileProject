import { useNavigation } from "@react-navigation/native";
import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import { Alert, Button, StyleSheet, TextInput, View } from "react-native";

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
      );`);
    console.log("DB Connected Add");
  } catch (error) {
    console.log("Error in connecting DB", error);
  }
};

export default function AddEarning() {
    return (
      <SQLiteProvider databaseName="MoneyDB.db" onInit={initializeDB}>
        <EarningInput />
      </SQLiteProvider>
    );
  }
  

export function EarningInput() {
  const db = useSQLiteContext();
  const navigation = useNavigation();
  const [type, setType] = useState("");
  const [sum, setSum] = useState("");
  const [mentions, setMentions] = useState("");

  const addEarning = async () => {
    const dateString = new Date().toISOString();
    const date = dateString.slice(0, dateString.indexOf("T")).split("-").reverse().join("-");


    try {
      await db.runAsync(
        "INSERT INTO earningsTable (type, sum, date, mentions) values (?, ?, ?, ?)",
        [type, parseInt(sum, 10), date, mentions]
      );
      Alert.alert("Success", "Earning Added");
      navigation.replace("Earnings");
    } catch (error) {
      console.error("Error adding earning:", error);
      Alert.alert("Error", "Failed to add earning");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        value={type}
        onChangeText={(text) => setType(text)}
        placeholder="Enter earning type (e.g., Salary, Bonus)"
      />
      <TextInput
        style={styles.textInput}
        value={sum}
        onChangeText={(text) => setSum(text)}
        placeholder="Enter earning sum"
        keyboardType="numeric"
      />
      <TextInput
        style={styles.textInput}
        value={mentions}
        onChangeText={(text) => setMentions(text)}
        placeholder="Enter any mentions (optional)"
        multiline={true}
      />
      <Button title="ADD EARNING" onPress={addEarning} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    fontSize: 16,
  },
});
