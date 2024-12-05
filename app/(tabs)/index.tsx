import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, Button, TextInput, Alert } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';

const initialData = [
  { id: '1', fullName: 'Juan Pérez', dateOfBirth: '1990-05-20', age: 30, gender: 'M', identificationNumber: '123456789', schooling: 'Primaria', grade: '2', riskFactor: 'obesidad', family: 'Pérez', location: 'Santo Domingo' },
  { id: '2', fullName: 'Ana Gómez', dateOfBirth: '1995-03-15', age: 25, gender: 'F', identificationNumber: '987654321', schooling: 'Secundaria', grade: '3', riskFactor: 'miopia', family: 'Gómez', location: 'Santo Domingo' },
  { id: '3', fullName: 'Carlos Díaz', dateOfBirth: '1980-12-10', age: 40, gender: 'M', identificationNumber: '112233445', schooling: 'Universitaria', grade: '2', riskFactor: 'miopia', family: 'Díaz', location: 'Santo Domingo' },
  { id: '4', fullName: 'Luisa Martínez', dateOfBirth: '1993-07-21', age: 27, gender: 'F', identificationNumber: '334455667', schooling: 'Primaria', grade: '5', riskFactor: 'hipertensión', family: 'Martínez', location: 'Santo Domingo' },
  { id: '5', fullName: 'Miguel Rodríguez', dateOfBirth: '1988-09-30', age: 32, gender: 'M', identificationNumber: '998877665', schooling: 'Secundaria', grade: '6', riskFactor: 'asma', family: 'Rodríguez', location: 'Santo Domingo' },
  { id: '6', fullName: 'Sandra López', dateOfBirth: '1999-11-05', age: 21, gender: 'F', identificationNumber: '765432109', schooling: 'Universitaria', grade: '1', riskFactor: 'ninguno', family: 'López', location: 'Santo Domingo' },
  { id: '7', fullName: 'José Fernández', dateOfBirth: '1985-01-13', age: 35, gender: 'M', identificationNumber: '543216789', schooling: 'Secundaria', grade: '4', riskFactor: 'diabetes', family: 'Fernández', location: 'Santo Domingo' },
  { id: '8', fullName: 'Patricia García', dateOfBirth: '1992-08-22', age: 28, gender: 'F', identificationNumber: '112233669', schooling: 'Primaria', grade: '3', riskFactor: 'hipertensión', family: 'García', location: 'Santo Domingo' },
  { id: '9', fullName: 'Raúl Martínez', dateOfBirth: '1998-03-02', age: 22, gender: 'M', identificationNumber: '234567890', schooling: 'Secundaria', grade: '5', riskFactor: 'miopia', family: 'Martínez', location: 'Santo Domingo' },
  { id: '10', fullName: 'Claudia Díaz', dateOfBirth: '1983-10-10', age: 37, gender: 'F', identificationNumber: '908172634', schooling: 'Universitaria', grade: '4', riskFactor: 'obesidad', family: 'Díaz', location: 'Santo Domingo' },
  { id: '11', fullName: 'Andrés Sánchez', dateOfBirth: '1990-06-16', age: 30, gender: 'M', identificationNumber: '667788990', schooling: 'Secundaria', grade: '3', riskFactor: 'miopia', family: 'Sánchez', location: 'Santo Domingo' },
  { id: '12', fullName: 'Rosa Pérez', dateOfBirth: '1994-01-01', age: 26, gender: 'F', identificationNumber: '223344556', schooling: 'Primaria', grade: '2', riskFactor: 'obesidad', family: 'Pérez', location: 'Santo Domingo' },
  { id: '13', fullName: 'Juan Carlos Herrera', dateOfBirth: '1987-12-20', age: 33, gender: 'M', identificationNumber: '554433221', schooling: 'Secundaria', grade: '6', riskFactor: 'hipertensión', family: 'Herrera', location: 'Santo Domingo' },
  { id: '14', fullName: 'María Sánchez', dateOfBirth: '1992-11-11', age: 28, gender: 'F', identificationNumber: '102938475', schooling: 'Universitaria', grade: '3', riskFactor: 'ninguno', family: 'Sánchez', location: 'Santo Domingo' },
  { id: '15', fullName: 'Javier González', dateOfBirth: '1981-04-18', age: 39, gender: 'M', identificationNumber: '768392145', schooling: 'Secundaria', grade: '4', riskFactor: 'asma', family: 'González', location: 'Santo Domingo' },
  { id: '16', fullName: 'Isabel Ruiz', dateOfBirth: '1997-05-09', age: 23, gender: 'F', identificationNumber: '987123456', schooling: 'Primaria', grade: '1', riskFactor: 'miopia', family: 'Ruiz', location: 'Santo Domingo' },
  { id: '17', fullName: 'Pedro Sánchez', dateOfBirth: '1996-02-28', age: 24, gender: 'M', identificationNumber: '654321987', schooling: 'Secundaria', grade: '5', riskFactor: 'diabetes', family: 'Sánchez', location: 'Santo Domingo' },
  { id: '18', fullName: 'Eva Rodríguez', dateOfBirth: '1999-08-17', age: 21, gender: 'F', identificationNumber: '321654987', schooling: 'Universitaria', grade: '2', riskFactor: 'ninguno', family: 'Rodríguez', location: 'Santo Domingo' },
  { id: '19', fullName: 'Manuel García', dateOfBirth: '1993-04-30', age: 27, gender: 'M', identificationNumber: '874563210', schooling: 'Secundaria', grade: '4', riskFactor: 'hipertensión', family: 'García', location: 'Santo Domingo' },
  { id: '20', fullName: 'Verónica López', dateOfBirth: '1990-09-25', age: 30, gender: 'F', identificationNumber: '333221987', schooling: 'Primaria', grade: '5', riskFactor: 'miopia', family: 'López', location: 'Santo Domingo' },
];

export default function HomeScreen() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(''); 
  const itemsPerPage = 10;

  const removeAccents = (str:string) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };

  const filteredData = initialData.filter(item =>
    removeAccents(item.family.toLowerCase()).includes(removeAccents(searchTerm.toLowerCase()))
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const goToNextPage = () => {
    if (currentPage < Math.ceil(filteredData.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const resetSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Funciones de los botones: Eliminar, Editar, Detalles
  const handleOpcion = (id:number) => {
    Alert.alert(
      'Eliminar Registro',
      '¿Estás seguro de que deseas eliminar este registro?',
      [
        { text: 'Cancelar' },
        { text: 'Eliminar', onPress: () => console.log(`Eliminar item con id ${id}`) },
      ]
    );
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={<></>}
    >
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por familia"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <Button title="Recargar" onPress={resetSearch} />
      </View>

      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableCell}>Nombre</Text>
          <Text style={styles.tableCell}>Fecha de nacimiento</Text>
          <Text style={styles.tableCell}>Edad</Text>
          <Text style={styles.tableCell}>Genero</Text>
          <Text style={styles.tableCell}>Cedula</Text>
          <Text style={styles.tableCell}>Escolaridad</Text>
          <Text style={styles.tableCell}>Grado</Text>
          <Text style={styles.tableCell}>Factor de Riesgo</Text>
          <Text style={styles.tableCell}>Familia</Text>
          <Text style={styles.tableCell}>Ubicacion</Text>
          <Text style={styles.tableCell}>Acciones</Text> 
        </View>

        <FlatList
          data={currentItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>{item.fullName}</Text>
              <Text style={styles.tableCell}>{item.dateOfBirth}</Text>
              <Text style={styles.tableCell}>{item.age}</Text>
              <Text style={styles.tableCell}>{item.gender}</Text>
              <Text style={styles.tableCell}>{item.identificationNumber}</Text>
              <Text style={styles.tableCell}>{item.schooling}</Text>
              <Text style={styles.tableCell}>{item.grade}</Text>
              <Text style={styles.tableCell}>{item.riskFactor}</Text>
              <Text style={styles.tableCell}>{item.family}</Text>
              <Text style={styles.tableCell}>{item.location}</Text>
              <View style={styles.actionsCell}>
                <Button title="Opciones"/>
              </View>
            </View>
          )}
        />
      </View>

      <View style={styles.pagination}>
        <Button title="Anterior" onPress={goToPreviousPage} />
        <Text>Página {currentPage}</Text>
        <Button title="Siguiente" onPress={goToNextPage} />
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  searchInput: {
    width: '80%',
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    height: 40,
    borderRadius: 5,
    backgroundColor: '#fff', 
  },
  tableContainer: {
    borderWidth: 2,
    borderColor: '#000',
    margin: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  tableHeader: {
    flex:5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f2f2f2',
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  tableCell: {
    flex:1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  actionsCell: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  tableRow: {
    backgroundColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  pagination: {
    backgroundColor: '#fff', 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
});


