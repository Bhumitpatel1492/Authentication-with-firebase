// import libraries
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SectionList, Image } from 'react-native';

// create a component
const HomeScreen = () => {
  const [listData, setListData] = useState([]);

  useEffect(() => {
    fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
      .then(response => response.json())
      .then(data => {
        const sections = data.categories.map(category => ({
          title: category.strCategory,
          data: [category],
        }));
        setListData(sections);
      })
      .catch(error => {
        console.log('Error fetching data:', error);
      });
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Image source={{ uri: item.strCategoryThumb }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.description}>{item.strCategoryDescription}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <SectionList
        sections={listData}
        keyExtractor={(item) => item.idCategory}
        stickySectionHeadersEnabled={true}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.headerContainer}>
            <Text style={styles.header}>{title}</Text>
          </View>
        )}
        renderItem={renderItem}
      />
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  headerContainer: {
    backgroundColor: '#f4f4f4',
    padding: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  item: {
    padding: 15,
    margin: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center',
  },
  image: {
    width: 250,
    height: 250,
    justifyContent: "center"
    // marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#555',
  },
});

// make this component available to the app
export default HomeScreen;
