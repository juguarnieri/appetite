import { View, Text, StyleSheet, Image } from 'react-native';

export default function Header() {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.logoContainer}>
        <Image 
          source={require('../../assets/talher.png')} 
          style={styles.logo}
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>APPETITE</Text>
          <Text style={styles.subtitle}>RECEITAS</Text>
        </View>
      </View>
      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: '#FFFCFC',
  },
  logoContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  logo: {
    width: 40,
    height: 50,
    marginBottom: 4,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 12,
    color: '#333',
    letterSpacing: 2,
    marginTop: 2,
  },
  divider: {
    height: 7,
    backgroundColor: '#2E7D32',
    width: '100%',
  },
});