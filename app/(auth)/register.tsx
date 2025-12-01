import React, { useState, useRef } from 'react';
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
import { User, Mail, Lock, Eye, EyeOff, UserPlus, Sparkles, CheckCircle2 } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/common/Button';
import { validation } from '@/utils/validation';

const { width, height } = Dimensions.get('window');

export default function RegisterScreen() {
  const { register } = useAuth();
  const { colors } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  React.useEffect(() => {
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
  }, []);

  const validateForm = () => {
    const nameError = validation.name(name);
    const emailError = validation.email(email);
    const passwordError = validation.password(password);
    const confirmPasswordError = password !== confirmPassword ? 'Passwords do not match' : null;

    setErrors({
      name: nameError || '',
      email: emailError || '',
      password: passwordError || '',
      confirmPassword: confirmPasswordError || '',
    });

    return !nameError && !emailError && !passwordError && !confirmPasswordError;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await register({ name, email, password });
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
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
                  <UserPlus size={44} color="#FFFFFF" strokeWidth={2.5} />
                </View>
                <View style={[styles.iconGlow, { backgroundColor: `${colors.primary}20` }]} />
              </View>
              
              <Text style={[styles.title, { color: colors.text }]}>
                Create Account
              </Text>
              <View style={styles.subtitleContainer}>
                <Sparkles size={16} color={colors.textSecondary} />
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                  Sign up to get started
                </Text>
              </View>
            </View>

            {/* Form Container with Card Style */}
            <View style={[styles.formCard, { 
              backgroundColor: colors.card || colors.background,
              shadowColor: colors.text,
            }]}>
              {/* Name Input */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>
                  Full Name
                </Text>
                <View style={[
                  styles.inputContainer,
                  { 
                    backgroundColor: `${colors.primary}05`,
                    borderColor: errors.name ? `${colors.error}` : 'transparent',
                  }
                ]}>
                  <View style={[styles.iconBox, {
                    backgroundColor: errors.name ? '#fee2e2' : `${colors.primary}10`
                  }]}>
                    <User size={20} color={errors.name ? `${colors.error}` : colors.primary} />
                  </View>
                  <TextInput
                    style={[styles.textInput, { color: colors.text }]}
                    placeholder="John Doe"
                    placeholderTextColor={colors.textSecondary}
                    value={name}
                    onChangeText={(text) => {
                      setName(text);
                      setErrors({ ...errors, name: '' });
                    }}
                    autoCapitalize="words"
                    autoComplete="name"
                    autoCorrect={false}
                  />
                </View>
                {errors.name ? (
                  <Text style={styles.errorText}>{errors.name}</Text>
                ) : null}
              </View>

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
                    placeholder="Create a password"
                    placeholderTextColor={colors.textSecondary}
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      setErrors({ ...errors, password: '' });
                    }}
                    secureTextEntry={!showPassword}
                    autoComplete="password-new"
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

              {/* Confirm Password Input */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>
                  Confirm Password
                </Text>
                <View style={[
                  styles.inputContainer,
                  { 
                    backgroundColor: `${colors.primary}05`,
                    borderColor: errors.confirmPassword ? `${colors.error}` : 'transparent',
                  }
                ]}>
                  <View style={[styles.iconBox, {
                    backgroundColor: errors.confirmPassword ? '#fee2e2' : `${colors.primary}10`
                  }]}>
                    <CheckCircle2 size={20} color={errors.confirmPassword ? `${colors.error}` : colors.primary} />
                  </View>
                  <TextInput
                    style={[styles.textInput, { color: colors.text }]}
                    placeholder="Confirm your password"
                    placeholderTextColor={colors.textSecondary}
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      setErrors({ ...errors, confirmPassword: '' });
                    }}
                    secureTextEntry={!showConfirmPassword}
                    autoComplete="password-new"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeButton}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.eyeIconBox, { backgroundColor: `${colors.primary}10` }]}>
                      {showConfirmPassword ? (
                        <EyeOff size={18} color={colors.textSecondary} />
                      ) : (
                        <Eye size={18} color={colors.textSecondary} />
                      )}
                    </View>
                  </TouchableOpacity>
                </View>
                {errors.confirmPassword ? (
                  <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                ) : null}
              </View>

              {/* Sign Up Button */}
              <Button
                title="Create Account"
                onPress={handleRegister}
                loading={loading}
                fullWidth
                style={styles.signUpButton}
              />
            </View>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              <View style={[styles.dividerTextWrapper, { backgroundColor: colors.background }]}>
                <Text style={[styles.dividerText, { color: colors.textSecondary }]}>
                  or
                </Text>
              </View>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            </View>

            {/* Sign In Link */}
            <View style={styles.signInContainer}>
              <Text style={[styles.signInText, { color: colors.textSecondary }]}>
                Already have an account?{' '}
              </Text>
              <Link href="/(auth)/login" asChild>
                <TouchableOpacity activeOpacity={0.7}>
                  <Text style={[styles.signInLink, { color: colors.primary }]}>
                    Sign In
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
    top: height * 0.25,
    right: -width * 0.25,
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
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    opacity: 0.8,
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
  signUpButton: {
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
    paddingHorizontal: 16,
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -20 }],
  },
  dividerText: {
    fontSize: 13,
    fontWeight: '500',
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  signInText: {
    fontSize: 15,
  },
  signInLink: {
    fontSize: 15,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});