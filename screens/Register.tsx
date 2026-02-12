import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import { useForm, Controller } from 'react-hook-form';
import { supabase } from '@/supabase/SupabaseClient';
import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {FormData} from '@/models/formdata';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogCloseButton,
    AlertDialogBackdrop,
} from '@/components/ui/alert-dialog';

import { AuthStackParamList } from '@/navigation_types/authstackparamlist';
import {registerScreenColor} from "@/colors/registerscreencolor";


const Register: React.FC = (): React.JSX.Element => {
    const [loading, setLoading] = useState<boolean>(false);
    const [alertOpen, setAlertOpen] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>('');

    const navigation =
        useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<FormData>({
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const password = watch('password');

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
            });

            if (error) {
                setAlertMessage(`Registration Failed: ${error.message}`);
            } else {
                setAlertMessage(
                    'Account created successfully 🎉\nPlease check your email to verify.'
                );
                setTimeout(() => {
                    navigation.navigate('Login');
                }, 1500);
            }
            setAlertOpen(true);
        } catch (err) {
            console.error(err);
            setAlertMessage('Something went wrong');
            setAlertOpen(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === 'android' ? 'padding' : undefined}
            >
                <LinearGradient
                    colors={registerScreenColor}
                    className="flex-1 justify-center px-6"
                >
                    <Box className="bg-white/90 rounded-3xl p-8 shadow-lg">
                        {/* Header */}
                        <Text className="text-3xl font-extrabold text-green-500 text-center mb-2">
                            Create Account
                        </Text>
                        <Text className="text-xl text-center text-green-600 mb-6">
                            Sign up to get started
                        </Text>

                        {/* Form */}
                        <VStack space="md">
                            {/* Email */}
                            <Controller
                                control={control}
                                name="email"
                                rules={{
                                    required: 'Email is required',
                                    pattern: {
                                        value: /\S+@\S+\.\S+/,
                                        message: 'Enter a valid email',
                                    },
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <Input size="lg" className="bg-gray-100 rounded-xl">
                                        <InputField
                                            placeholder="Email"
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                            value={value}
                                            onChangeText={onChange}
                                        />
                                    </Input>
                                )}
                            />
                            {errors.email && (
                                <Text className="text-red-500 text-sm">
                                    {errors.email.message}
                                </Text>
                            )}

                            {/* Password */}
                            <Controller
                                control={control}
                                name="password"
                                rules={{
                                    required: 'Password is required',
                                    minLength: {
                                        value: 6,
                                        message: 'Minimum 6 characters',
                                    },
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <Input size="lg" className="bg-gray-100 rounded-xl">
                                        <InputField
                                            placeholder="Password"
                                            secureTextEntry
                                            value={value}
                                            onChangeText={onChange}
                                        />
                                    </Input>
                                )}
                            />
                            {errors.password && (
                                <Text className="text-red-500 text-sm">
                                    {errors.password.message}
                                </Text>
                            )}

                            {/* Confirm Password */}
                            <Controller
                                control={control}
                                name="confirmPassword"
                                rules={{
                                    required: 'Confirm your password',
                                    validate: (value) =>
                                        value === password || 'Passwords do not match',
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <Input size="lg" className="bg-gray-100 rounded-xl">
                                        <InputField
                                            placeholder="Confirm Password"
                                            secureTextEntry
                                            value={value}
                                            onChangeText={onChange}
                                        />
                                    </Input>
                                )}
                            />
                            {errors.confirmPassword && (
                                <Text className="text-red-500 text-sm">
                                    {errors.confirmPassword.message}
                                </Text>
                            )}

                            {/* Register Button */}
                            <Button
                                size="lg"
                                className="mt-2 bg-green-600 rounded-xl py-3"
                                onPress={handleSubmit(onSubmit)}
                                disabled={loading}
                            >
                                <ButtonText className="text-white font-bold">
                                    {loading ? 'Creating account...' : 'Register'}
                                </ButtonText>
                            </Button>
                        </VStack>

                        {/* Footer */}
                        <Box className="mt-6 items-center">
                            <Text className="text-lg text-blue-600">
                                Already have an account?{' '}
                                <Text
                                    className="text-green-700 text-lg font-semibold"
                                    onPress={() => navigation.navigate('Login')}
                                >
                                    Login
                                </Text>
                            </Text>
                        </Box>
                    </Box>
                </LinearGradient>
            </KeyboardAvoidingView>

            {/* Alert Dialog */}
            <AlertDialog isOpen={alertOpen} onClose={() => setAlertOpen(false)}>
                <AlertDialogBackdrop />
                <AlertDialogContent>
                    <AlertDialogHeader>Notification</AlertDialogHeader>
                    <AlertDialogBody>{alertMessage}</AlertDialogBody>
                    <AlertDialogFooter>
                        <AlertDialogCloseButton>OK</AlertDialogCloseButton>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default Register;
