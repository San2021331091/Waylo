import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform} from 'react-native';
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
import {AuthStackParamList} from "@/navigation_types/authstackparamlist";
import {RootStackParamList} from "@/navigation_types/rootstackparamlist.ts";
import {loginScreenColor} from "@/colors/loginscreencolor";


const Login: React.FC = (): React.JSX.Element => {
    const [loading, setLoading] = useState<boolean>(false);
    const [alertOpen, setAlertOpen] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>('');

    const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
     const homeNavigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues: { email: '', password: '' },
    });

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        try {
            const { data: loginData, error } = await supabase.auth.signInWithPassword({
                email: data.email,
                password: data.password,
            });

            if (error) {
                setAlertMessage(`Login Failed: ${error.message}`);
                setAlertOpen(true);
            } else {
                setAlertMessage(`Welcome ${loginData.user?.email}`);
                setAlertOpen(true);

                setTimeout(() => homeNavigation.navigate('AppTabs'), 2000);
            }
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
                    colors={loginScreenColor}
                    className="flex-1 justify-center px-6"
                >
                    <Box className="bg-white/90 rounded-3xl p-8 shadow-lg">
                        {/* Header */}
                        <Text className="text-3xl font-extrabold text-green-500 text-center mb-2">
                            Welcome Back
                        </Text>
                        <Text className="text-xl text-center text-green-600 mb-6">
                            Sign in to continue
                        </Text>

                        {/* Form */}
                        <VStack space="md">
                            {/* Email */}
                            <Controller
                                control={control}
                                name="email"
                                rules={{
                                    required: 'Email is required',
                                    pattern: { value: /\S+@\S+\.\S+/, message: 'Enter a valid email' },
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
                                <Text className="text-red-500 text-sm">{errors.email.message}</Text>
                            )}

                            {/* Password */}
                            <Controller
                                control={control}
                                name="password"
                                rules={{
                                    required: 'Password is required',
                                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
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
                                <Text className="text-red-500 text-sm">{errors.password.message}</Text>
                            )}

                            {/* Login Button */}
                            <Button
                                size="lg"
                                className="mt-2 bg-green-600 rounded-xl py-3"
                                onPress={handleSubmit(onSubmit)}
                                disabled={loading}
                            >
                                <ButtonText className="text-white font-bold">
                                    {loading ? 'Logging in...' : 'Login'}
                                </ButtonText>
                            </Button>
                        </VStack>

                        {/* Footer */}

                        <Box className="mt-6 items-center">
                            <Text className="text-lg text-blue-600">
                                Don’t have an account?{'  '}
                                <Text
                                    className="text-green-700 text-lg font-semibold"
                                    onPress={() => navigation.navigate('Register')}
                                >
                                    Register
                                </Text>
                            </Text>
                        </Box>

                    </Box>
                </LinearGradient>
            </KeyboardAvoidingView>


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

export default Login;
