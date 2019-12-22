import React, { Component } from 'react';
import { View, Text, StyleSheet, Button, Image, Alert } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { TextInput, TouchableOpacity, FlatList } from 'react-native-gesture-handler';
import SQLite from 'react-native-sqlite-storage';
import {connect} from 'react-redux'
const db = SQLite.openDatabase({ name: 'myProject.db', location: 'default' });

class NewRecord extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photo: null,
      bookName: '',
      bookAuthor: '',
      bookUri: '',
    }
    db.transaction((tx) => {
      //tx.executeSql('DROP TABLE Books')
      tx.executeSql('CREATE TABLE IF NOT EXISTS Books(book_id INTEGER PRIMARY KEY NOT NULL,book_name VARCHAR(30),book_author VARCHAR(30),book_uri VARCHAR(50))', []);
    })
  }
  handleChoosePhoto = () => {
    const options = {
      noData: true
    };
    ImagePicker.launchImageLibrary(options, response => {
      if (response.uri) {
        this.setState({ bookUri: response.uri, photo: response });
      }
    })
  }
  saveBook = () => {
    db.transaction(tx => {
      tx.executeSql('INSERT INTO Books (book_name,book_author,book_uri) VALUES (:book_name,:book_author,:book_uri)', [this.state.bookName, this.state.bookAuthor, this.state.bookUri]);
      tx.executeSql('SELECT * FROM Books', [], (tx, results) => {
        this.setState({ bookList: [...this.state.bookList, results.rows.item(results.rows.length - 1)] })
      });
    })
    Alert.alert('SAVE BOOK');
  }
  render() {
    const { photo } = this.state;
    return (
      <View style={styles.container}>
        <Text>Book Name</Text>
        <TextInput
          placeholder='Book Name'
          style={{ backgroundColor: 'grey', width: 150 }}
          onChangeText={(value) => this.setState({ bookName: value })}
        />
        <Text>Book Author</Text>
        <TextInput
          placeholder='Book Author'
          style={{ backgroundColor: 'grey', width: 150 }}
          onChangeText={(value) => this.setState({ bookAuthor: value })}
        />
        {photo && (
          <Image
            source={{ uri: photo.uri }}
            style={{ width: 250, height: 250 }}
          />)}
        <Button title="Choose Photo" onPress={() => this.handleChoosePhoto()} />
        <TouchableOpacity onPress={() => this.saveBook()}>
          <View style={{ backgroundColor: 'green', width: 100, height: 50, justifyContent: 'center', alignItems: 'center', marginTop: 25 }}>
            <Text>SAVE BOOK</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>this.props.Increase()}>
            <Text>Increase</Text>
          </TouchableOpacity>
  <Text>{this.props.counter}</Text>
          <TouchableOpacity onPress={()=>this.props.Decrease()}>
            <Text>Decrease</Text>
          </TouchableOpacity>
      </View>
    );
  }
}
function mapStateToProps(state){ //MAPLEME YAPARAK COMPONENTTE KULLANDIĞIMIZ COUNTERI APP TEKİ COUNTERE MATCHLEDİK
  return{
    counter:state.counter
  }
}
function mapDispatchToProps(dispatch){ //EĞER SADECE LİSTELEME YAPACAKSAK BUNA GEREK YOK AMA STATE'İ DEĞİŞTİRCEKSEK BU LAZIM
  return {
    Increase : ()=>dispatch({type:'INCREASE_COUNTER'}),
    Decrease : ()=>dispatch({type:'DECREASE_COUNTER'}),
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(NewRecord)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
