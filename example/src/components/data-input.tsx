import React, { useRef, useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
type NumericObject = Record<string, number>;

interface DataInputProps<TData extends NumericObject> {
  name: keyof TData;
  setData: React.Dispatch<React.SetStateAction<TData>>;
  data: TData;
  // Optional props for the slider functionality
  minValue?: number;
  maxValue?: number;
  step?: number;
}

export default function DataInput<TData extends NumericObject>({
  name,
  setData,
  data,
  minValue = 0,
  maxValue = 10,
  step = 0.1,
}: DataInputProps<TData>) {
  const value = data[name] as number;
  const prevValue = useRef(value);
  const [textValue, setTextValue] = useState(String(value));
  function updateData(newValue: number) {
    setData((oldData) => ({
      ...oldData,
      [name]: newValue,
    }));
  }
  function handleTextChange(newText: string) {
    setTextValue(newText);

    const parsedValue = parseFloat(newText);
    if (!isNaN(parsedValue)) {
      updateData(parsedValue);
    }
  }

  function handleChange(newValue: number) {
    setTextValue(String(newValue));
    updateData(+newValue.toFixed(2));
  }

  if (value !== prevValue.current) {
    if (value !== parseFloat(textValue)) {
      setTextValue(String(value));
    }
    prevValue.current = value;
  }

  const textError = textValue !== String(value);
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.label}>{String(name)}</Text>
        <Text style={styles.valueDisplay}>{value}</Text>
      </View>
      <View style={styles.inputRow}>
        <TextInput
          onChangeText={handleTextChange}
          keyboardType="numeric"
          value={textValue}
          returnKeyType={'done'}
          style={[styles.textInput, textError && styles.textError]}
        />
        <Slider
          style={styles.slider}
          minimumValue={minValue}
          maximumValue={maxValue}
          step={step}
          value={value}
          onValueChange={handleChange}
          minimumTrackTintColor="#2E86C1"
          maximumTrackTintColor="#D5DBDB"
          thumbTintColor="#2E86C1"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  label: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  valueDisplay: {
    color: '#F4F6F6',
    fontSize: 16,
    fontWeight: '600',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    width: 50,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 8,
    marginRight: 10,
    fontSize: 12,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#34495E',
    textAlignVertical: 'center',
    paddingVertical: 6,
    borderWidth: 2,
  },
  textError: {
    borderColor: 'red',
  },
  slider: {
    flex: 1,
    height: 20,
  },
});
