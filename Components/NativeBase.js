/**
 * Minimal compatibility layer replacing native-base 2.x.
 *
 * native-base 2.x cannot run on React 19 / React Native 0.81:
 *  - its theme engine (native-base-shoutem-theme) relies on the legacy React
 *    context API which was removed in React 19, and
 *  - many of its components import ViewPropTypes from 'react-native', which
 *    was removed in RN 0.69+.
 *
 * The app only ever used a small, simple subset of native-base, re-implemented
 * here with plain React Native primitives:
 *   Root, Container, Content, Card, View, Text, Icon, Toast
 */
import React from 'react';
import {
  View as RNView,
  Text as RNText,
  ScrollView,
  StyleSheet,
} from 'react-native';
import SimpleToast from 'react-native-simple-toast';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';

export const View = RNView;
export const Text = RNText;

export function Root(props) {
  return <RNView style={styles.root} {...props} />;
}

export function Container({style, children, ...rest}) {
  return (
    <RNView style={[styles.container, style]} {...rest}>
      {children}
    </RNView>
  );
}

export function Content({style, contentContainerStyle, children, ...rest}) {
  return (
    <ScrollView
      style={[styles.content, style]}
      contentContainerStyle={contentContainerStyle}
      keyboardShouldPersistTaps="handled"
      {...rest}>
      {children}
    </ScrollView>
  );
}

export function Card({style, children, ...rest}) {
  return (
    <RNView style={[styles.card, style]} {...rest}>
      {children}
    </RNView>
  );
}

const ICON_FAMILIES = {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome,
  AntDesign,
  Entypo,
  Feather,
};

export function Icon({type = 'Ionicons', name, style, ...rest}) {
  const IconComponent = ICON_FAMILIES[type] || Ionicons;
  // native-base icons defaulted to a larger size; keep a sane default while
  // letting callers override via the style prop (fontSize/color).
  const flat = StyleSheet.flatten(style) || {};
  return (
    <IconComponent
      name={name}
      size={flat.fontSize || 24}
      color={flat.color}
      style={style}
      {...rest}
    />
  );
}

export const Toast = {
  show(options) {
    const text =
      typeof options === 'string' ? options : (options && options.text) || '';
    if (!text) {
      return;
    }
    const duration =
      options && options.duration && options.duration > 2500
        ? SimpleToast.LONG
        : SimpleToast.SHORT;
    SimpleToast.show(text, duration);
  },
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e0e0e0',
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.15,
    shadowRadius: 1.5,
    elevation: 2,
  },
});
