import React, { useMemo } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import DraggableFlatList, {
  ScaleDecorator,
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import { Stream } from '../types';
import AnimatedStreamCard from './AnimatedStreamCard';
import { spacing } from '../constants/theme';
import useStreamStore from '../store/streamStore';

interface StreamGridProps {
  streams: Stream[];
  onStreamPress: (stream: Stream) => void;
  isDraggable?: boolean;
}

const { width: screenWidth } = Dimensions.get('window');

export default function StreamGrid({
  streams,
  onStreamPress,
  isDraggable = true,
}: StreamGridProps) {
  const { gridLayout, customLayout, reorderStreams, removeStream } = useStreamStore();

  const { itemWidth, itemHeight, numColumns } = useMemo(() => {
    let cols = 2;
    
    switch (gridLayout) {
      case '1x1':
        cols = 1;
        break;
      case '2x2':
        cols = 2;
        break;
      case '3x3':
        cols = 3;
        break;
      case 'custom':
        cols = customLayout.cols;
        break;
    }

    const totalSpacing = spacing.md * (cols + 1);
    const width = (screenWidth - totalSpacing) / cols;
    const height = width * 0.75;

    return {
      itemWidth: width,
      itemHeight: height,
      numColumns: cols,
    };
  }, [gridLayout, customLayout]);

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Stream>) => {
    return (
      <ScaleDecorator>
        <AnimatedStreamCard
          stream={item}
          onPress={() => onStreamPress(item)}
          onRemove={() => removeStream(item.id)}
          width={itemWidth}
          height={itemHeight}
          index={streams.indexOf(item)}
        />
      </ScaleDecorator>
    );
  };

  if (!isDraggable || streams.length <= 1) {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {streams.map((stream, index) => (
            <AnimatedStreamCard
              key={stream.id}
              stream={stream}
              onPress={() => onStreamPress(stream)}
              onRemove={() => removeStream(stream.id)}
              width={itemWidth}
              height={itemHeight}
              index={index}
            />
          ))}
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <DraggableFlatList
        data={streams}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onDragEnd={({ from, to }) => reorderStreams(from, to)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        activationDistance={20}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: spacing.sm,
    justifyContent: 'center',
  },
  listContent: {
    paddingVertical: spacing.sm,
  },
});