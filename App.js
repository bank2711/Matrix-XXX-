import React, { useState, useEffect, useRef } from 'react';  
import { View, Text, TextInput, ScrollView, StyleSheet, Button, Animated } from 'react-native';

const App = () => {
  const [rowsA, setRowsA] = useState(2);
  const [colsA, setColsA] = useState(2);
  const [rowsB, setRowsB] = useState(2);
  const [colsB, setColsB] = useState(2);
  const [matrixA, setMatrixA] = useState(createMatrix(2, 2));
  const [matrixB, setMatrixB] = useState(createMatrix(2, 2));
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const fadeAnim = useRef(new Animated.Value(1)).current;

  function createMatrix(rows, cols) {
    return Array.from({ length: rows }, () => Array(cols).fill(''));
  }

  const handleMatrixChange = (matrix, setMatrix, row, col, value) => {
    const updatedMatrix = [...matrix];
    updatedMatrix[row][col] = value === '' ? '' : Number(value);
    setMatrix(updatedMatrix);
  };

  const validateDimensions = () => {
    if (colsA !== rowsB) {
      setErrorMessage('The number of columns of Matrix A must be equal to the number of rows of Matrix B.');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const handleCalculate = () => {
    if (!validateDimensions()) return;

    const resultMatrix = Array.from({ length: rowsA }, () => Array(colsB).fill(0));

    for (let i = 0; i < rowsA; i++) {
      for (let j = 0; j < colsB; j++) {
        for (let k = 0; k < colsA; k++) {
          resultMatrix[i][j] += (matrixA[i][k] || 0) * (matrixB[k][j] || 0);
        }
      }
    }

    setResult(resultMatrix);
  };

  const handleDimensionsChange = () => {
    if (!validateDimensions()) return;
    setMatrixA(createMatrix(rowsA, colsA));
    setMatrixB(createMatrix(rowsB, colsB));
    setResult(null);
  };

  const handleDimensionInput = (value, setter) => {
    const numValue = Number(value);
    setter(numValue);
  };

  useEffect(() => {
    const fadeInOut = () => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
      ]).start(() => fadeInOut());
    };

    fadeInOut();
  }, [fadeAnim]);

  useEffect(() => {
    handleDimensionsChange();
  }, [rowsA, colsA, rowsB, colsB]);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={true} 
      showsHorizontalScrollIndicator={true} 
      indicatorStyle="white" 
    >
      <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>Matrix XXX</Animated.Text>

      <View style={styles.dimensionInputContainer}>
        <Text style={styles.label}>Matrix A Dimensions</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            value={String(rowsA)}
            onChangeText={(value) => handleDimensionInput(value, setRowsA)}
            placeholder="Rows"
          />
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            value={String(colsA)}
            onChangeText={(value) => handleDimensionInput(value, setColsA)}
            placeholder="Columns"
          />
        </View>
      </View>

      <View style={styles.dimensionInputContainer}>
        <Text style={styles.label}>Matrix B Dimensions</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            value={String(rowsB)}
            onChangeText={(value) => handleDimensionInput(value, setRowsB)}
            placeholder="Rows"
          />
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            value={String(colsB)}
            onChangeText={(value) => handleDimensionInput(value, setColsB)}
            placeholder="Columns"
          />
        </View>
      </View>

      {errorMessage !== '' && <Text style={styles.errorMessage}>{errorMessage}</Text>}

      <View style={styles.matrixContainer}>
        <View style={styles.matrixWrapper}>
          <View style={styles.matrixBlock}>
            <Text style={styles.matrixLabel}>Matrix A</Text>
            <ScrollView horizontal={true}>
              <View>
                {matrixA.map((row, i) => (
                  <View key={i} style={styles.row}>
                    {row.map((value, j) => (
                      <TextInput
                        key={j}
                        style={styles.matrixInput}
                        keyboardType="number-pad"
                        value={value === '' ? '' : String(value)}
                        onChangeText={(val) => handleMatrixChange(matrixA, setMatrixA, i, j, val)}
                      />
                    ))}
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.matrixBlock}>
            <Text style={styles.matrixLabel}>Matrix B</Text>
            <ScrollView horizontal={true}>
              <View>
                {matrixB.map((row, i) => (
                  <View key={i} style={styles.row}>
                    {row.map((value, j) => (
                      <TextInput
                        key={j}
                        style={styles.matrixInput}
                        keyboardType="number-pad"
                        value={value === '' ? '' : String(value)}
                        onChangeText={(val) => handleMatrixChange(matrixB, setMatrixB, i, j, val)}
                      />
                    ))}
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </View>

      <Text style={styles.infoMessage}>"You can scroll left and right to view the matrix as its size increases."</Text>

      <Button title="Calculate" onPress={handleCalculate} color="#5cb85c" />

      {result && (
        <View>
          <Text style={styles.matrixLabel}>Result</Text>
          <ScrollView horizontal={true}>
            <View>
              {result.map((row, i) => (
                <View key={i} style={styles.row}>
                  {row.map((value, j) => (
                    <Text key={j} style={styles.resultCell}>{value}</Text>
                  ))}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#000000', // Black background
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#00FF00', // Green color like in old assembly screens
    fontFamily: 'monospace',
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
    color: '#00FF00',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 15,
  },
  input: {
    width: '45%',
    height: 40,
    borderWidth: 1,
    borderColor: '#00FF00',
    paddingLeft: 10,
    fontSize: 16,
    color: '#00FF00', // Green text
    backgroundColor: '#333',
  },
  matrixContainer: {
    width: '100%',
    marginTop: 30,
    alignItems: 'center',
  },
  matrixWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    flexWrap: 'wrap',
  },
  matrixBlock: {
    width: '48%',
    marginBottom: 20,
    alignItems: 'center',
    marginHorizontal: '1%',
    borderWidth: 1,
    borderColor: '#00FF00',
    backgroundColor: '#222',
  },
  matrixLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#00FF00',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 5,
  },
  matrixInput: {
    width: 50, // เพิ่มความกว้าง
    height: 50, // เพิ่มความสูง
    borderWidth: 1,
    borderColor: '#00FF00',
    textAlign: 'center',
    marginHorizontal: 2,
    fontSize: 16,
    color: '#00FF00', // สีตัวอักษร
    backgroundColor: '#222',
  },
  
  resultCell: {
    width: 35,
    height: 35,
    borderWidth: 1,
    borderColor: '#00FF00',
    textAlign: 'center',
    marginHorizontal: 2,
    fontSize: 16,
    color: '#00FF00', // Green color
    backgroundColor: '#222',
  },
  errorMessage: {
    color: 'red',
    fontSize: 16,
    marginTop: 10,
  },
  infoMessage: {
    fontSize: 14,
    color: '#00FF00',
    marginTop: 10,
  },
});

export default App;
