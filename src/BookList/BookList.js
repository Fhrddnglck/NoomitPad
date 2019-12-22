import React, { Component } from 'react';
import { View, Text, FlatList, Image } from 'react-native';
import { connect } from 'react-redux'

class BookList extends React.Component {
    render() {
        return (
            <View>
                <Text>BOOK List</Text>
                <FlatList
                    data={this.props.bookListReduxExp}
                    keyExtractor={(index) => index}
                    renderItem={({ item }) =>
                        <View>
                            <Image
                                source={{ uri: item.book_uri }}
                                style={{ width: 150, height: 150 }}
                            />
                            <Text>{item.book_name}</Text>
                        </View>}
                />
            </View>
        )
    }
}
function mapStateToProps(state) { //MAPLEME YAPARAK COMPONENTTE KULLANDIĞIMIZ COUNTERI APP TEKİ COUNTERE MATCHLEDİK
    return {
        bookListReduxExp: state.bookListReduxExp
    }
}

export default connect(mapStateToProps)(BookList)