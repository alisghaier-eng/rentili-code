import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { TextInput, Button, RadioButton } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import axios from 'axios';
import { Linking } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";


export default function SignUpScreen({ navigation }) {
  const [userType, setUserType] = useState('client');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
 
 
   // Champs pour client
   const [birthDate, setBirthDate] = useState('');
   const [gender, setGender] = useState('');
   const [profileImage, setProfileImage] = useState(null);
   const [address, setAddress] = useState('');
   const [driverLicenseImage, setDriverLicenseImage] = useState(null);
   // Champs pour agence
  const [agencyId, setAgencyId] = useState('');
  const [agencyName, setAgencyName] = useState('');
  const [location, setLocation] = useState(null);
  const [mapImage, setMapImage] = useState(null);
  const openMap = (latitude, longitude) => {
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    Linking.openURL(url).catch(err => {
      console.error('Erreur lors de l\'ouverture de la carte :', err);
      Alert.alert('Erreur', 'Impossible d\'ouvrir la carte.');
    });
  };
  

  const handleImagePick = async (setImage) => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert(
          "Permission requise",
          "Permission d'accès à la galerie est nécessaire pour sélectionner une image."
        );
        return;
      }
  
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'Images', // Correction ici
        allowsEditing: true,
        quality: 1,
      });
  
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Erreur lors de la sélection de l'image :", error);
      Alert.alert("Erreur", "Une erreur est survenue lors de la sélection de l'image.");
    }
  };
  
  
  const handleLocationFetch = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'La permission d\'accéder à la localisation est requise.');
        return;
      }
  
      const userLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = userLocation.coords;
  
      setLocation({ latitude, longitude });
  
      // Générer une URL d'image statique avec OpenStreetMap
      const mapUrl = `https://static-maps.yandex.ru/1.x/?ll=${longitude},${latitude}&size=600,300&z=15&l=map&pt=${longitude},${latitude},pm2rdm`;
  
      setMapImage(mapUrl);
    } catch (error) {
      console.error('Erreur lors de la récupération de la localisation :', error);
      Alert.alert('Erreur', 'Impossible d\'obtenir votre localisation.');
    }
  };
  
  
  const handleSignUp = async () => {
    if (!email.trim() || !password || !confirmPassword || !phoneNumber.trim()) {
      Alert.alert('Erreur', 'Tous les champs obligatoires doivent être remplis.');
      return;
    }
  
    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
      return;
    }
  
    if (userType === 'agence' && (!location || !location.latitude || !location.longitude)) {
      Alert.alert('Erreur', 'La localisation est requise pour les agences.');
      return;
    }
  
    const user = {
      role: userType,
      email,
      password,
      phoneNumber,
      ...(userType === 'client' && {
        birthDate,
        gender,
        profileImage,
        address,
        driverLicenseImage,
      }),
      ...(userType === 'agence' && {
        agencyId,
        agencyName,
        longitude,
        latitude,
      }),
    };
  
    try {
      const response = await axios.post('http://192.168.217.57:5000/signUp', user);
      Alert.alert('Inscription réussie !', 'Vous pouvez maintenant vous connecter.');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Erreur lors de l\'inscription :', error.response?.data || error.message);
  
      // Afficher des messages d'erreur plus précis si disponibles
      const errorMessage = error.response?.data?.message || 'Problème lors de l\'inscription.';
      Alert.alert('Erreur', errorMessage);
    }
  };
  // Fonction pour afficher le calendrier
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  // Fonction pour masquer le calendrier
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Créez votre compte</Text>
      <Text style={styles.subtitle}>Rejoignez-nous pour louer une voiture facilement</Text>

      <Text style={styles.label}>Vous êtes :</Text>
      <RadioButton.Group onValueChange={setUserType} value={userType}>
        <View style={styles.radioButtonContainer}>
          <RadioButton value="client" />
          <Text style={styles.radioLabel}>Client</Text>
        </View>
        <View style={styles.radioButtonContainer}>
          <RadioButton value="agence" />
          <Text style={styles.radioLabel}>Agence</Text>
        </View>
      </RadioButton.Group>


      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        mode="outlined"
        autoCapitalize="none"
        keyboardType="email-address"
        left={<TextInput.Icon name="email" />}
        theme={{ colors: { primary: '#6200ea' } }}
      />

      <TextInput
        label="Mot de passe"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        mode="outlined"
        secureTextEntry
        left={<TextInput.Icon name="lock" />}
        theme={{ colors: { primary: '#6200ea' } }}
      />

      <TextInput
        label="Confirmer le mot de passe"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={styles.input}
        mode="outlined"
        secureTextEntry
        left={<TextInput.Icon name="lock" />}
        theme={{ colors: { primary: '#6200ea' } }}
      />

      <TextInput
        label="Numéro de téléphone"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        style={styles.input}
        mode="outlined"
        keyboardType="phone-pad"
        left={<TextInput.Icon name="phone" />}
        theme={{ colors: { primary: '#6200ea' } }}
      />

      {/* Champs client */}
      {userType === 'client' && (
        <>
       <TextInput
  label="Date de naissance"
  value={birthDate}
  onChangeText={setBirthDate}
  style={[styles.input, styles.inputWithShadow]}  // Application du même style avec ombre
  mode="outlined"  // Mode outline pour un effet de bordure claire
  theme={{
    colors: { 
      primary: '#6200ea',  // Couleur du label
      underlineColor: 'transparent', // Désactivation de la ligne en dessous
    }
  }}
  secureTextEntry  // Ajouter secureTextEntry pour masquer l'entrée (comme pour le mot de passe)
  left={<TextInput.Icon name="calendar" />}  // Icône pour la date, remplace "lock" par "calendar"
  keyboardType="numeric"  // Clavier numérique pour entrer la date
/>



<TextInput
  label="Adresse"
  value={address}
  onChangeText={setAddress}
  style={[styles.input, styles.inputWithShadow]}  // Application du même style avec ombre
  mode="outlined"  // Mode outline pour un effet de bordure claire
  theme={{
    colors: {
      primary: '#6200ea',  // Couleur du label
      underlineColor: 'transparent',  // Désactivation de la ligne en dessous
    }
  }}
  left={<TextInput.Icon name="home" />}  // Icône pour l'adresse, remplace "lock" par "home"
  keyboardType="default"  // Clavier par défaut pour entrer du texte
/>

          <Text style={styles.label}>Genre :</Text>
          <RadioButton.Group onValueChange={setGender} value={gender}>
            <View style={styles.radioButtonContainer}>
              <RadioButton value="Homme" />
              <Text>Homme</Text>
              <RadioButton value="Femme" />
              <Text>Femme</Text>
            </View>
          </RadioButton.Group>
          <Button mode="outlined" onPress={() => handleImagePick(setProfileImage)}>Ajouter Photo</Button>
          <Button mode="outlined" onPress={() => handleImagePick(setDriverLicenseImage)}>Ajouter Permis</Button>
        </>
      )}

      {userType === 'agence' && (
        <><TextInput
        label="Identifiant Agence"
        value={agencyId}
        onChangeText={setAgencyId}
        style={[styles.input, styles.inputWithShadow]}  // Application du même style avec ombre
        mode="outlined"  // Mode outline pour un effet de bordure claire
        theme={{
          colors: {
            primary: '#6200ea',  // Couleur du label
            underlineColor: 'transparent',  // Désactivation de la ligne en dessous
          }
        }}
        left={<TextInput.Icon name="account-building" />}  // Icône pour l'agence (ici "account-building" pour un identifiant d'agence)
        keyboardType="default"  // Clavier par défaut pour entrer du texte
      />
      
      
      <TextInput
  label="Nom Agence"
  value={agencyName}
  onChangeText={setAgencyName}
  style={[styles.input, styles.inputWithShadow]}  // Application du même style avec ombre
  mode="outlined"  // Mode outline pour un effet de bordure claire
  theme={{
    colors: {
      primary: '#6200ea',  // Couleur du label
      underlineColor: 'transparent',  // Désactivation de la ligne en dessous
    }
  }}
  left={<TextInput.Icon name="business" />}  // Icône pour le nom de l'agence (remplace "home" par "business")
  keyboardType="default"  // Clavier par défaut pour entrer du texte
/>

          <Text style={styles.label}>Localisation :</Text>
          <Button mode="contained" onPress={handleLocationFetch} style={styles.locationButton}>
            Préciser ma localisation
          </Button>
          {location && (
            <View>
              <Text style={styles.coordinates}>
                Localisation : Latitude {location.latitude.toFixed(5)}, Longitude {location.longitude.toFixed(5)}
              </Text>
              {mapImage && (
  <TouchableOpacity onPress={() => openMap(location.latitude, location.longitude)}>
    <Image source={{ uri: mapImage }} style={styles.mapImage} />
  </TouchableOpacity>
)}

            </View>
          )}
        </>
      )}

      <Button mode="contained" onPress={handleSignUp} style={styles.button}>
        S'inscrire
      </Button>

      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.link}>
        <Text style={styles.linkText}>Déjà un compte ? Connectez-vous</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f4f5fa', // Gris clair pour un fond doux
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#4a148c', // Violet foncé pour le titre principal
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 25,
    color: '#6c757d', // Gris pour le sous-titre
    lineHeight: 24,
  },
  input: {
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingLeft: 10,
    elevation: 2, // Légère ombre pour les inputs
  },
  button: {
    marginTop: 20,
    borderRadius: 30,
    backgroundColor: '#6200ea', // Bleu-violet vif
    paddingVertical: 12,
    elevation: 4, // Ombre pour le bouton
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
  },
  link: {
    marginTop: 15,
    alignItems: 'center',
  },
  linkText: {
    color: '#6200ea', // Même couleur que le bouton pour une cohérence
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
    fontWeight: '600',
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 5,
  },
  radioLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 5,
  },
  imagePickerButton: {
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#ece7ff', // Fond violet clair
    padding: 10,
  },
  imageSelected: {
    fontSize: 14,
    color: '#4a148c',
    marginTop: 5,
    fontStyle: 'italic',
  },
  locationButton: {
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#d1e7dd', // Vert clair pour la localisation
    padding: 10,
  },
  coordinates: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
    fontStyle: 'italic',
  },
  mapImage: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 15,
    borderColor: '#ddd',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
