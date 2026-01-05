import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

const { width, height } = Dimensions.get('window');
const RADISH = '#D32F2F';
const LIGHT_RED = '#ffd6d6';

const vw = width / 100;
const vh = height / 100;

const demoImages = [
  require('../../demos/image0.png'),
  require('../../demos/image1.png'),
  require('../../demos/image2.png'),
  require('../../demos/image3.png'),
  require('../../demos/image4.png'),
  require('../../demos/image5.png'),
  require('../../demos/image6.png'),
  require('../../demos/image7.png'),
];

export default function DemoShowcase() {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const isLandscape = width > height;
  const isMobile = width < 768;

  const itemsPerRow = isLandscape ? (isMobile ? 2 : 4) : (isMobile ? 2 : 3);
  const itemWidth = (width - vw * 8) / itemsPerRow;
  const itemHeight = itemWidth * 1.2;

  const renderDemoItem = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => setSelectedImageIndex(index)}
      style={[
        styles.demoThumbnail,
        {
          width: itemWidth - vw * 1.5,
          height: itemHeight,
          borderWidth: selectedImageIndex === index ? 3 : 2,
          borderColor: selectedImageIndex === index ? RADISH : '#ddd',
          opacity: selectedImageIndex === index ? 1 : 0.7,
        },
      ]}
      activeOpacity={0.8}
    >
      <Image
        source={item}
        style={styles.thumbnailImage}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Ionicons name="image" size={vw * 5} color={RADISH} />
        <Text style={styles.title}>App Highlights</Text>
      </View>

      {/* Main Image Display */}
      <View style={[
        styles.mainImageContainer,
        { height: isLandscape ? vh * 50 : vh * 35 }
      ]}>
        <Image
          source={demoImages[selectedImageIndex]}
          style={styles.mainImage}
          resizeMode="contain"
        />
      </View>

      {/* Image Counter */}
      <View style={styles.counterContainer}>
        <Text style={styles.counterText}>
          {selectedImageIndex + 1} / {demoImages.length}
        </Text>
      </View>

      {/* Thumbnail Grid */}
      <View style={[
        styles.thumbnailContainer,
        { paddingBottom: vh * 2 }
      ]}>
        <FlatList
          data={demoImages}
          renderItem={renderDemoItem}
          keyExtractor={(_, index) => index.toString()}
          numColumns={itemsPerRow}
          scrollEnabled={false}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.flatListContent}
        />
      </View>

      {/* Navigation Arrows (Desktop) */}
      {!isMobile && (
        <View style={styles.navigationContainer}>
          <TouchableOpacity
            onPress={() => setSelectedImageIndex(
              selectedImageIndex === 0 ? demoImages.length - 1 : selectedImageIndex - 1
            )}
            style={[styles.navButton, { marginRight: vw * 2 }]}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={vw * 4} color={RADISH} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedImageIndex(
              selectedImageIndex === demoImages.length - 1 ? 0 : selectedImageIndex + 1
            )}
            style={styles.navButton}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-forward" size={vw * 4} color={RADISH} />
          </TouchableOpacity>
        </View>
      )}

      {/* Dots Indicator */}
      <View style={styles.dotsContainer}>
        {demoImages.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor: selectedImageIndex === index ? RADISH : '#ccc',
                width: selectedImageIndex === index ? vw * 2.5 : vw * 2,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: vh * 2,
    paddingHorizontal: vw * 4,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vh * 2,
  },
  title: {
    fontSize: RFValue(18),
    fontFamily: 'Outfit-Bold',
    color: '#D32F2F',
    marginLeft: vw * 2,
  },
  mainImageContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: LIGHT_RED,
    marginBottom: vh * 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  counterContainer: {
    alignItems: 'center',
    marginBottom: vh * 1,
  },
  counterText: {
    fontSize: RFValue(13),
    color: '#666',
    fontFamily: 'Outfit-Regular',
  },
  thumbnailContainer: {
    marginBottom: vh * 1.5,
  },
  flatListContent: {
    paddingHorizontal: 0,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: vw * 2,
  },
  demoThumbnail: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: vh * 1,
  },
  navButton: {
    width: vw * 10,
    height: vw * 10,
    borderRadius: vw * 5,
    backgroundColor: LIGHT_RED,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: vh * 1,
  },
  dot: {
    height: vw * 2,
    borderRadius: vw * 1,
    marginHorizontal: vw * 0.5,
  },
});
