import React, {useState} from 'react';
import {Text, View, Image, TouchableOpacity, StyleSheet} from 'react-native';

const PostContent = () => {
  const postDescription =
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
  const [showMore, setShowMore] = useState(false);

  return (
    <View style={styles.postContentContainer}>
      {postDescription.length > 120 ? (
        showMore ? (
          <TouchableOpacity onPress={() => setShowMore(!showMore)}>
            <Text style={styles.postDescription}>{postDescription}</Text>
            <Text style={styles.seeMore}>Show less</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setShowMore(!showMore)}>
            <Text style={styles.postDescription}>
              {`${postDescription.slice(0, 120)}... `}
            </Text>
            <Text style={styles.seeMore}>Show more</Text>
          </TouchableOpacity>
        )
      ) : (
        <Text style={styles.postDescription}>{postDescription}</Text>
      )}
    </View>
  );
};

export default PostContent;

const styles = StyleSheet.create({
  postContentContainer: {
    // borderWidth: 1,
    // borderColor: 'red',
    flexDirection: 'column',
  },

  postMedia: {
    //borderWidth: 1,
    //borderColor: 'red',
    width: '100%',
    height: 280,
    resizeMode: 'cover',
  },

  postDescription: {
    paddingTop: 15,
    paddingHorizontal: 15,
    color: 'black',
  },

  seeMore: {
    paddingHorizontal: 15,
    color: 'grey',
    fontStyle: 'italic',
    textDecorationLine: 'underline',
  },
});