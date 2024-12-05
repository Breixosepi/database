import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	Text,
	View,
	FlatList,
	Button,
	TextInput,
	Alert,
} from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";

const url = "https://medicine-backend-8n75.onrender.com/api/patient";
const itemsPerPage = 10;

export default function HomeScreen() {
	const [currentPage, setCurrentPage] = useState(1);
	const [searchTerm, setSearchTerm] = useState("");
	const [patients, setPatients] = useState([]);

	useEffect(() => {
		(async () => {
			try {
				const response = await fetch(url);
				if (!response.ok) {
					throw new Error(`Response status: ${response.status}`);
				}

				const json = await response.json();
				console.log(json);
				setPatients(json);
			} catch (error: any) {
				console.error(error.message);
			}
		})();
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
	const handleOpcion = (id: number) => {
		Alert.alert(
			"Eliminar Registro",
			"¿Estás seguro de que deseas eliminar este registro?",
			[
				{ text: "Cancelar" },
				{
					text: "Eliminar",
					onPress: () => console.log(`Eliminar item con id ${id}`),
				},
			]
		);
	};

	return (
		<ParallaxScrollView
			headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
			headerImage={<></>}
		>
			<View style={styles.searchContainer}>
				<TextInput
					style={styles.searchInput}
					placeholder='Buscar por familia'
					value={searchTerm}
					onChangeText={setSearchTerm}
				/>
				<Button title='Recargar' onPress={resetSearch} />
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
					keyExtractor={(item: any) => item.id}
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
								<Button title='Opciones' />
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
		</ParallaxScrollView>
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
		flex: 5,
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
		justifyContent: "space-around",
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
});
