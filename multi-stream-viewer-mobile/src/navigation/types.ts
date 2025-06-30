import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Stream } from '../types';

export type RootTabParamList = {
  Streams: undefined;
  Discover: undefined;
  Features: undefined;
  Settings: undefined;
};

export type StreamsStackParamList = {
  StreamsList: undefined;
  StreamDetail: { stream: Stream };
  AddStream: undefined;
};

export type RootStackParamList = {
  Main: undefined;
  AddStream: undefined;
  StreamDetail: { stream: Stream };
};

// Navigation prop types
export type StreamsScreenNavigationProp = StackNavigationProp<StreamsStackParamList, 'StreamsList'>;
export type StreamDetailScreenNavigationProp = StackNavigationProp<StreamsStackParamList, 'StreamDetail'>;

// Route prop types
export type StreamDetailScreenRouteProp = RouteProp<StreamsStackParamList, 'StreamDetail'>;