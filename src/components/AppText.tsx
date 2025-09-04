import React from 'react';
import { Text, StyleSheet, TextProps, TextStyle } from 'react-native';

interface AppTextProps extends TextProps {
  style?: TextStyle | TextStyle[];
}

export default function AppText({ children, style, ...rest }: AppTextProps) {
  return (
    <Text style={[styles.text, style]} {...rest}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Poppins-Light', // use o nome da fonte que carregou com useFonts
    fontSize: 16,                  // tamanho padrão, pode ajustar
    color: '#000',                 // cor padrão, pode personalizar
  },
});
