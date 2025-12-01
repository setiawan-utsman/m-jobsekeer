import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
  TextInput
} from 'react-native';
import { Link } from 'expo-router';
import { Mail, Lock, Eye, EyeOff, LogIn, Sparkles, TentTree, Biohazard, Fingerprint } from 'lucide-react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/common/Button';
import { validation } from '@/utils/validation';
import { APP_CONFIG } from '@/utils/constants';
import Toast from 'react-native-toast-message';

const { width, height } = Dimensions.get('window');

// Keys untuk menyimpan credentials di SecureStore
const BIOMETRIC_ENABLED_KEY = 'biometric_enabled';
const STORED_EMAIL_KEY = 'stored_email';
const STORED_PASSWORD_KEY = 'stored_password';

export default function LoginScreen() {
  const { login } = useAuth();
  const { colors } = useTheme();
  const [email, setEmail] = useState('developer@localhost.com');
  const [password, setPassword] = useState('@developer');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  
  // Biometric states
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricType, setBiometricType] = useState<string>('');

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const biometricPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animation startup
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 0,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Check biometric support
    checkBiometricSupport();
    checkBiometricEnabled();
  }, []);

  // Pulse animation untuk biometric button
  const startBiometricPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(biometricPulse, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(biometricPulse, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const checkBiometricSupport = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);

      if (compatible) {
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        if (enrolled) {
          const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
          if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
            setBiometricType('Fingerprint');
          } else if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
            setBiometricType('Face ID');
          } else {
            setBiometricType('Biometric');
          }
          startBiometricPulse();
        }
      }
    } catch (error) {
      console.error('Error checking biometric support:', error);
    }
  };

  const checkBiometricEnabled = async () => {
    try {
      const enabled = await SecureStore.getItemAsync(BIOMETRIC_ENABLED_KEY);
      setBiometricEnabled(enabled === 'true');
    } catch (error) {
      console.error('Error checking biometric enabled:', error);
    }
  };

  const saveBiometricCredentials = async (email: string, password: string) => {
    try {
      await SecureStore.setItemAsync(BIOMETRIC_ENABLED_KEY, 'true');
      await SecureStore.setItemAsync(STORED_EMAIL_KEY, email);
      await SecureStore.setItemAsync(STORED_PASSWORD_KEY, password);
      setBiometricEnabled(true);
      Toast.show({
        type: 'success',
        text1: 'Biometric Enabled',
        text2: `${biometricType} login has been enabled`,
      });
    } catch (error) {
      console.error('Error saving biometric credentials:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to enable biometric login',
      });
    }
  };

  const handleBiometricLogin = async () => {
    try {
      // Check if biometric is enrolled
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        Alert.alert(
          'Biometric Not Set Up',
          'Please set up biometric authentication in your device settings first.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Authenticate with biometric
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: `Login with ${biometricType}`,
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
        fallbackLabel: 'Use Password',
      });

      if (result.success) {
        // Retrieve stored credentials
        const storedEmail = await SecureStore.getItemAsync(STORED_EMAIL_KEY);
        const storedPassword = await SecureStore.getItemAsync(STORED_PASSWORD_KEY);

        if (storedEmail && storedPassword) {
          setLoading(true);
          try {
            await login({ email: storedEmail, password: storedPassword });
            Toast.show({
              type: 'success',
              text1: 'Welcome Back!',
              text2: 'Login successful',
            });
          } catch (error: any) {
            Toast.show({
              type: 'error',
              text1: 'Login Failed',
              text2: error.message || 'An error occurred',
            });
          } finally {
            setLoading(false);
          }
        } else {
          Alert.alert(
            'No Saved Credentials',
            'Please login with email and password first to enable biometric login.',
            [{ text: 'OK' }]
          );
        }
      } else {
        // Authentication failed or was cancelled
        if (result.error === 'user_cancel' || result.error === 'system_cancel') {
          // User cancelled, do nothing
        } else {
          Toast.show({
            type: 'error',
            text1: 'Authentication Failed',
            text2: 'Please try again',
          });
        }
      }
    } catch (error) {
      console.error('Biometric authentication error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Biometric authentication failed',
      });
    }
  };

  const validateForm = () => {
    const emailError = validation.email(email);
    const passwordError = validation.password(password);

    setErrors({
      email: emailError || '',
      password: passwordError || '',
    });

    return !emailError && !passwordError;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await login({ email, password });
      
      // Jika login berhasil dan biometric supported, tawarkan untuk enable biometric
      if (isBiometricSupported && !biometricEnabled) {
        Alert.alert(
          'Enable Biometric Login?',
          `Would you like to enable ${biometricType} login for faster access next time?`,
          [
            {
              text: 'Not Now',
              style: 'cancel',
            },
            {
              text: 'Enable',
              onPress: () => saveBiometricCredentials(email, password),
            },
          ]
        );
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: error.message || 'An error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  const disableBiometric = async () => {
    Alert.alert(
      'Disable Biometric Login?',
      'You will need to login with email and password next time.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Disable',
          style: 'destructive',
          onPress: async () => {
            try {
              await SecureStore.deleteItemAsync(BIOMETRIC_ENABLED_KEY);
              await SecureStore.deleteItemAsync(STORED_EMAIL_KEY);
              await SecureStore.deleteItemAsync(STORED_PASSWORD_KEY);
              setBiometricEnabled(false);
              Toast.show({
                type: 'success',
                text1: 'Biometric Disabled',
                text2: 'Biometric login has been disabled',
              });
            } catch (error) {
              console.error('Error disabling biometric:', error);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Decorative Background Elements */}
      <View style={styles.decorativeContainer}>
        <View style={[styles.circle1, { backgroundColor: `${colors.primary}10` }]} />
        <View style={[styles.circle2, { backgroundColor: `${colors.primary}08` }]} />
        <View style={[styles.circle3, { backgroundColor: `${colors.primary}05` }]} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <Animated.View
            style={[
              styles.contentContainer,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim }
                ]
              }
            ]}
          >
            {/* Header with Enhanced Icon */}
            <View style={styles.headerContainer}>
              <View style={styles.iconWrapper}>
                <View style={[styles.iconGradient, { backgroundColor: colors.primary }]}>
                  <Biohazard size={44} color="#FFFFFF" strokeWidth={2.5} />
                </View>
                <View style={[styles.iconGlow, { backgroundColor: `${colors.primary}20` }]} />
              </View>

              <Text style={[styles.title, { color: colors.text }]}>
                {APP_CONFIG.NAME}
              </Text>
              <View style={styles.subtitleContainer}>
                <Sparkles size={16} color={colors.textSecondary} />
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                  Sign in to continue your scientific projects
                </Text>
              </View>
            </View>

            {/* Biometric Login Button - Show if enabled */}
            {isBiometricSupported && biometricEnabled && (
              <Animated.View style={{ transform: [{ scale: biometricPulse }] }}>
                <TouchableOpacity
                  style={[styles.biometricButton, { 
                    backgroundColor: `${colors.primary}15`,
                    borderColor: colors.primary,
                  }]}
                  onPress={handleBiometricLogin}
                  activeOpacity={0.7}
                >
                  <View style={[styles.biometricIconWrapper, { backgroundColor: colors.primary }]}>
                    <Fingerprint size={28} color="#FFFFFF" strokeWidth={2} />
                  </View>
                  <View style={styles.biometricTextContainer}>
                    <Text style={[styles.biometricTitle, { color: colors.text }]}>
                      Login with {biometricType}
                    </Text>
                    <Text style={[styles.biometricSubtitle, { color: colors.textSecondary }]}>
                      Quick and secure access
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.biometricSettingsButton}
                    onPress={disableBiometric}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Text style={[styles.biometricSettingsText, { color: colors.textSecondary }]}>
                      ⚙️
                    </Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              </Animated.View>
            )}

            {/* Divider if biometric is shown */}
            {isBiometricSupported && biometricEnabled && (
              <View style={styles.dividerContainer}>
                <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
                <View style={[styles.dividerTextWrapper, { backgroundColor: colors.background }]}>
                  <Text style={[styles.dividerText, { color: colors.textSecondary }]}>
                    {/* or sign in with email */}
                  </Text>
                </View>
                <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              </View>
            )}

            {/* Form Container with Card Style */}
            <View style={[styles.formCard, {
              backgroundColor: colors.card || colors.background,
              shadowColor: colors.text,
            }]}>
              {/* Email Input */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>
                  Email Address
                </Text>
                <View style={[
                  styles.inputContainer,
                  {
                    backgroundColor: `${colors.primary}05`,
                    borderColor: errors.email ? `${colors.error}` : 'transparent',
                  }
                ]}>
                  <View style={[styles.iconBox, {
                    backgroundColor: errors.email ? '#fee2e2' : `${colors.primary}10`
                  }]}>
                    <Mail size={20} color={errors.email ? `${colors.error}` : colors.primary} />
                  </View>
                  <TextInput
                    style={[styles.textInput, { color: colors.text }]}
                    placeholder="yourname@email.com"
                    placeholderTextColor={colors.textSecondary}
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      setErrors({ ...errors, email: '' });
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect={false}
                  />
                </View>
                {errors.email ? (
                  <Text style={styles.errorText}>{errors.email}</Text>
                ) : null}
              </View>

              {/* Password Input */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>
                  Password
                </Text>
                <View style={[
                  styles.inputContainer,
                  {
                    backgroundColor: `${colors.primary}05`,
                    borderColor: errors.password ? `${colors.error}` : 'transparent',
                  }
                ]}>
                  <View style={[styles.iconBox, {
                    backgroundColor: errors.password ? '#fee2e2' : `${colors.primary}10`
                  }]}>
                    <Lock size={20} color={errors.password ? `${colors.error}` : colors.primary} />
                  </View>
                  <TextInput
                    style={[styles.textInput, { color: colors.text }]}
                    placeholder="Enter your password"
                    placeholderTextColor={colors.textSecondary}
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      setErrors({ ...errors, password: '' });
                    }}
                    secureTextEntry={!showPassword}
                    autoComplete="password"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeButton}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.eyeIconBox, { backgroundColor: `${colors.primary}10` }]}>
                      {showPassword ? (
                        <EyeOff size={18} color={colors.textSecondary} />
                      ) : (
                        <Eye size={18} color={colors.textSecondary} />
                      )}
                    </View>
                  </TouchableOpacity>
                </View>
                {errors.password ? (
                  <Text style={styles.errorText}>{errors.password}</Text>
                ) : null}
              </View>

              {/* Forgot Password Link */}
              <TouchableOpacity
                style={styles.forgotPasswordButton}
                activeOpacity={0.7}
              >
                <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>

              {/* Sign In Button */}
              <Button
                title="Sign In"
                onPress={handleLogin}
                loading={loading}
                fullWidth
                style={styles.signInButton}
              />
            </View>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              <View style={[styles.dividerTextWrapper, { backgroundColor: colors.background }]}>
                <Text style={[styles.dividerText, { color: colors.textSecondary }]}>
                  {/* or */}
                </Text>
              </View>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            </View>

            {/* Sign Up Link */}
            <View style={styles.signUpContainer}>
              <Text style={[styles.signUpText, { color: colors.textSecondary }]}>
                Don't have an account?{' '}
              </Text>
              <Link href="/(auth)/register" asChild>
                <TouchableOpacity activeOpacity={0.7}>
                  <Text style={[styles.signUpLink, { color: colors.primary }]}>
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  decorativeContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  circle1: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    top: -width * 0.4,
    right: -width * 0.3,
  },
  circle2: {
    position: 'absolute',
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    bottom: -width * 0.2,
    left: -width * 0.3,
  },
  circle3: {
    position: 'absolute',
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: width * 0.25,
    top: height * 0.3,
    left: -width * 0.2,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  contentContainer: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconWrapper: {
    position: 'relative',
    marginBottom: 20,
  },
  iconGradient: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  iconGlow: {
    position: 'absolute',
    width: 108,
    height: 108,
    borderRadius: 54,
    top: -10,
    left: -10,
    zIndex: -1,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: -0.5,
    textAlign: 'center'
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    opacity: 0.8,
  },
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 2,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  biometricIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  biometricTextContainer: {
    flex: 1,
  },
  biometricTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  biometricSubtitle: {
    fontSize: 13,
    opacity: 0.7,
  },
  biometricSettingsButton: {
    padding: 8,
  },
  biometricSettingsText: {
    fontSize: 20,
  },
  formCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 2,
    paddingLeft: 12,
    paddingRight: 12,
    height: 56,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    height: 56,
  },
  eyeButton: {
    marginLeft: 8,
  },
  eyeIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 24,
    marginTop: -8,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '600',
  },
  signInButton: {
    marginTop: 8,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    position: 'relative',
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerTextWrapper: {
    // paddingHorizontal: 16,
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -20 }],
  },
  dividerText: {
    fontSize: 13,
    fontWeight: '500',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  signUpText: {
    fontSize: 15,
  },
  signUpLink: {
    fontSize: 15,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});