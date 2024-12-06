import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	Text,
	View,
	FlatList,
	Button,
	TextInput,
	Alert,
	Modal,
	TouchableOpacity,
	ScrollView,
} from "react-native";

const url = "https://medicine-backend-8n75.onrender.com/api/patient";
// const url = "localhost:4000/api/patient";
const itemsPerPage = 10;

export default function HomeScreen() {
	const [currentPage, setCurrentPage] = useState(1);
	const [searchTerm, setSearchTerm] = useState("");
	const [patients, setPatients] = useState<any[]>([]);
	const [showForm, setShowForm] = useState(false); // Estado para mostrar/ocultar formulario
	const [newPatient, setNewPatient] = useState({
		fullName: "",
		dateOfBirth: "",
		age: "",
		gender: "",
		identificationNumber: "",
		schooling: "",
		grade: "",
		riskFactor: "",
		family: "",
		location: "",
	});

	const [selectedPatient, setSelectedPatient] = useState<any | null>(null); // Paciente seleccionado para editar/eliminar
	const [showOptions, setShowOptions] = useState(false); // Estado para mostrar opciones (editar/eliminar)

	const fetchPatients = async () => {
		try {
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error(`Response status: ${response.status}`);
			}

			const json = await response.json();
			setPatients(json);
		} catch (error: any) {
			console.error(error.message);
		}
	};

	useEffect(() => {
		fetchPatients();
	}, []);

	useEffect(() => {
		setCurrentPage(1);
	}, [searchTerm]);

	const removeAccents = (str?: string) => {
		if (!str) return "";
		return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
	};

	const filteredData = patients.filter((item: any) =>
		removeAccents(item?.family?.toLowerCase()).includes(
			removeAccents(searchTerm.toLowerCase())
		)
	);

	const startIndex = (currentPage - 1) * itemsPerPage;
	const currentItems = filteredData.slice(
		startIndex,
		startIndex + itemsPerPage
	);

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
		setSearchTerm("");
		setCurrentPage(1);
	};

	// Funciones de los botones: Eliminar, Editar, Detalles
	const handleDelete = (id: number) => {
		(async () => {
			await fetch(url, {
				method: "DELETE",
				body: JSON.stringify({ id }),
				headers: {
					"Content-Type": "application/json",
				},
			});
			await fetchPatients();
		})();
		closeActionMenu();
	};

	const handleEdit = () => {
		// Aquí puedes abrir un modal o formulario de edición con los datos del paciente seleccionado.
		setShowForm(true);
		setNewPatient(selectedPatient);
	};

	const showActionMenu = (patient: any) => {
		setSelectedPatient(patient);
		setShowOptions(true); // Mostrar opciones de editar/eliminar
	};

	const closeActionMenu = () => {
		setShowOptions(false);
		setSelectedPatient(null); // Limpiar paciente seleccionado
	};

	// Función para abrir el formulario
	const openForm = () => {
		setShowForm(true);
	};

	// Función para cerrar el formulario
	const closeForm = () => {
		setShowForm(false);
		setNewPatient({
			fullName: "",
			dateOfBirth: "",
			age: "",
			gender: "",
			identificationNumber: "",
			schooling: "",
			grade: "",
			riskFactor: "",
			family: "",
			location: "",
		});
	};

	// Función para manejar el envío del formulario
	const handleSubmit = () => {
		if (
			!newPatient.fullName ||
			!newPatient.dateOfBirth ||
			!newPatient.age ||
			!newPatient.gender ||
			!newPatient.identificationNumber ||
			!newPatient.schooling ||
			!newPatient.grade ||
			!newPatient.riskFactor ||
			!newPatient.family ||
			!newPatient.location
		) {
			alert("Por favor, complete todos los campos.");
			return;
		}

		// Aquí se podría enviar los datos a la API para guardar el nuevo paciente
		if (selectedPatient) {
			(async () => {
				await fetch(url, {
					method: "PATCH",
					body: JSON.stringify({ id: selectedPatient.id, ...newPatient }),
					headers: {
						"Content-Type": "application/json",
					},
				});
				await fetchPatients();
			})();
		} else {
			(async () => {
				await fetch(url, {
					method: "POST",
					body: JSON.stringify(newPatient),
					headers: {
						"Content-Type": "application/json",
					},
				});
				await fetchPatients();
			})();
		}

		// Limpiar formulario y cerrar
		setNewPatient({
			fullName: "",
			dateOfBirth: "",
			age: "",
			gender: "",
			identificationNumber: "",
			schooling: "",
			grade: "",
			riskFactor: "",
			family: "",
			location: "",
		});
		setShowForm(false);
		closeActionMenu();
	};

	return (
		<ScrollView>
			<View style={styles.searchContainer}>
				<TextInput
					style={styles.searchInput}
					placeholder='Buscar por familia'
					value={searchTerm}
					onChangeText={setSearchTerm}
				/>
				<Button title='Recargar' onPress={resetSearch} />
			</View>

			<Button title='Agregar Nuevo Paciente' onPress={openForm} />

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
					keyExtractor={(item: any) => item.id.toString()}
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
								<Button title='Opciones' onPress={() => showActionMenu(item)} />
							</View>
						</View>
					)}
				/>
			</View>

			<View style={styles.pagination}>
				<Button title='Anterior' onPress={goToPreviousPage} />
				<Text>Página {currentPage}</Text>
				<Button title='Siguiente' onPress={goToNextPage} />
			</View>

			{/* Opciones Modal */}
			<Modal visible={showOptions} animationType='slide' transparent={true}>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContent}>
						<Text style={styles.modalTitle}>Seleccione una opción</Text>

						<Button title='Editar' onPress={handleEdit} />
						<Button
							title='Eliminar'
							onPress={() => handleDelete(selectedPatient.id)}
						/>

						<TouchableOpacity onPress={closeActionMenu}>
							<Text style={styles.modalCloseButton}>Cerrar</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>

			{/* Formulario Modal */}
			<Modal visible={showForm} animationType='slide' transparent={true}>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContent}>
						<Text style={styles.modalTitle}>Formulario de Nuevo Paciente</Text>

						<TextInput
							style={styles.input}
							placeholder='Nombre'
							value={newPatient.fullName}
							onChangeText={(text) =>
								setNewPatient({ ...newPatient, fullName: text })
							}
						/>
						<TextInput
							style={styles.input}
							placeholder='Fecha de Nacimiento'
							value={newPatient.dateOfBirth}
							onChangeText={(text) =>
								setNewPatient({ ...newPatient, dateOfBirth: text })
							}
						/>
						<TextInput
							style={styles.input}
							placeholder='Edad'
							value={newPatient.age}
							onChangeText={(text) =>
								setNewPatient({ ...newPatient, age: text })
							}
						/>
						<TextInput
							style={styles.input}
							placeholder='Género'
							value={newPatient.gender}
							onChangeText={(text) =>
								setNewPatient({ ...newPatient, gender: text })
							}
						/>
						<TextInput
							style={styles.input}
							placeholder='Cédula'
							value={newPatient.identificationNumber}
							onChangeText={(text) =>
								setNewPatient({ ...newPatient, identificationNumber: text })
							}
						/>
						<TextInput
							style={styles.input}
							placeholder='Escolaridad'
							value={newPatient.schooling}
							onChangeText={(text) =>
								setNewPatient({ ...newPatient, schooling: text })
							}
						/>
						<TextInput
							style={styles.input}
							placeholder='Grado'
							value={newPatient.grade}
							onChangeText={(text) =>
								setNewPatient({ ...newPatient, grade: text })
							}
						/>
						<TextInput
							style={styles.input}
							placeholder='Factor de Riesgo'
							value={newPatient.riskFactor}
							onChangeText={(text) =>
								setNewPatient({ ...newPatient, riskFactor: text })
							}
						/>
						<TextInput
							style={styles.input}
							placeholder='Familia'
							value={newPatient.family}
							onChangeText={(text) =>
								setNewPatient({ ...newPatient, family: text })
							}
						/>
						<TextInput
							style={styles.input}
							placeholder='Ubicación'
							value={newPatient.location}
							onChangeText={(text) =>
								setNewPatient({ ...newPatient, location: text })
							}
						/>

						<View style={styles.modalActions}>
							<Button title='Cancelar' onPress={closeForm} />
							<Button title='Guardar' onPress={handleSubmit} />
						</View>
					</View>
				</View>
			</Modal>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	searchContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		padding: 10,
	},
	searchInput: {
		width: "80%",
		borderColor: "#ccc",
		borderWidth: 1,
		paddingHorizontal: 10,
		height: 40,
		borderRadius: 5,
		backgroundColor: "#fff",
	},
	tableContainer: {
		borderWidth: 2,
		borderColor: "#000",
		margin: 10,
		borderRadius: 10,
		overflow: "hidden",
	},
	tableHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		backgroundColor: "#f2f2f2",
		paddingVertical: 10,
		borderBottomWidth: 2,
		borderBottomColor: "#000",
	},
	tableCell: {
		flex: 1,
		fontSize: 16,
		fontWeight: "bold",
		color: "#333",
		textAlign: "center",
		paddingVertical: 5,
		paddingHorizontal: 10,
	},
	actionsCell: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 5,
	},
	tableRow: {
		backgroundColor: "#e0e0e0",
		flexDirection: "row",
		justifyContent: "space-between",
		paddingHorizontal: 10,
		paddingVertical: 10,
		borderBottomWidth: 1,
		borderBottomColor: "#ccc",
	},
	pagination: {
		backgroundColor: "#fff",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 10,
	},
	modalOverlay: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	modalContent: {
		backgroundColor: "white",
		padding: 20,
		borderRadius: 10,
		width: "80%",
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 10,
	},
	input: {
		borderWidth: 1,
		borderColor: "#ccc",
		padding: 10,
		marginBottom: 10,
		borderRadius: 5,
	},
	modalActions: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 20,
	},
	modalCloseButton: {
		color: "blue",
		textAlign: "center",
		marginTop: 10,
	},
});
