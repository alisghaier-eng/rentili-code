import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { PaperProvider } from 'react-native-paper';
import { IconButton } from 'react-native-paper'; // Pour l'icône hamburger
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import des composants d'écran
import HomepageAgence from './screens/HomepageAgence';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import AccountScreen from './screens/AccountScreens';
import DetailsVoiture from './screens/DetailsVoiture';
import Confirmation from './screens/Confirmation';
import DetailVoitureAgence from './screens/DetailsVoitureAgence';
import AjouterVoiture from './screens/AjouterVoiture';
import HomepageClient from './screens/HomepageClient';
import theme from './theme'; // Assurez-vous que le fichier de thème existe
import PaymentPage from './screens/PaymentPage'
import CardScreen from './screens/CardScreen';

// Création des navigators
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// Stack pour la navigation principale
function HomeStack({ navigation }) {
  return (
    <Stack.Navigator>
      {/* Ajouter HomepageClient et HomepageAgence au Stack Navigator */}
      <Stack.Screen
        name="HomepageClient" // Assurez-vous que le nom est correct ici
        component={HomepageClient}
        options={{
          title: 'Les voitures',
          headerLeft: () => (
            <IconButton
              icon="menu"
              onPress={() => navigation.toggleDrawer()} // Ouvre le Drawer
            />
          ),
        }}
      />
      <Stack.Screen
        name="CardScrenn" // Assurez-vous que le nom est correct ici
        component={CardScreen}
        options={{
          title: 'Les voitures dans le chariot ',
          headerLeft: () => (
            <IconButton
              icon="menu"
              onPress={() => navigation.toggleDrawer()} // Ouvre le Drawer
            />
          ),
        }}
      />
      <Stack.Screen
        name="HomepageAgence" 
        component={HomepageAgence}
        options={{
          title: 'Les voitures de l\'agence',
          headerLeft: () => (
            <IconButton
              icon="menu"
              onPress={() => navigation.toggleDrawer()} // Ouvre le Drawer
            />
          ),
        }}
      />

      {/* Ecran pour ajouter une voiture (accessible uniquement par les agences) */}
      <Stack.Screen
        name="AjouterVoiture"
        component={AjouterVoiture}
        options={{ title: 'Ajouter une voiture' }}
      />
      
      {/* Ecran de détail de la voiture dans l'agence */}
      <Stack.Screen
        name="DetailVoitureAgence"
        component={DetailVoitureAgence}
        options={{ title: 'Détails de la voiture' }}
      />

      {/* Ecran de détail de la voiture (accessible par les clients aussi) */}
      <Stack.Screen
        name="DetailsVoiture"
        component={DetailsVoiture}
        options={{ title: 'Détails de la voiture' }}
      />

      {/* Ecran de confirmation de réservation */}
      <Stack.Screen
        name="Confirmation"
        component={Confirmation}
        options={{ title: 'Confirmation' }}
      />
      <Stack.Screen
    name="PaymentPage"
    component={PaymentPage}
    options={{
      title: 'Paiement',
      headerStyle: {
        backgroundColor: '#6200ea', // Couleur d'en-tête
      },
      headerTintColor: '#fff', // Couleur du texte de l'en-tête
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  />
  <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{
          title: 'Connexion',
          headerStyle: {
            backgroundColor: '#6200ea',
          },
          headerTintColor: '#fff',
        }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Vérification de l'état d'authentification
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const role = await AsyncStorage.getItem('userRole');
        console.log('Token:', token, 'Role:', role); // Debug
        if (token && role) {
          setIsAuthenticated(true);
          setUserRole(role);
        } else {
          setIsAuthenticated(false);
          setUserRole(null);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données d’authentification:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  if (loading) {
    return null; // Ajoutez un indicateur de chargement si nécessaire
  }

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Drawer.Navigator
          initialRouteName={isAuthenticated ? 'Home' : 'Login'} // Si non authentifié, va sur Login
          screenOptions={{
            headerShown: false,
          }}
        >
          {/* Page d’accueil (client ou agence) */}
          <Drawer.Screen
            name="Home"
            component={HomeStack}
            options={{
              title: isAuthenticated && userRole === 'agence' ? 'Agence' : 'Catalogue',
            }}
          />
          {/* Page de connexion */}
          <Drawer.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: 'Connexion' }}
          />
          {/* Page d’inscription */}
          <Drawer.Screen
            name="SignUp"
            component={SignUpScreen}
            options={{ title: 'Inscription' }}
          />
          {/* Page de gestion du compte */}
          <Drawer.Screen
            name="Account"
            component={AccountScreen}
            options={{ title: 'Mon Compte' }}
          />
          <Drawer.Screen
            name="chariot"
            component={CardScreen}
            options={{ title: 'Mon chariot' }}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
