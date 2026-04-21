import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';

export default function Register() {
    const [role, setRole] = useState('user');

    return (
        <>
            <Head title="Daftar" />
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">{role === 'organizer' ? 'Nama Organisasi' : 'Nama Lengkap'}</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder={role === 'organizer' ? 'Nama Organisasi' : 'Nama Lengkap'}
                                />
                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Alamat Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="email@contoh.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Kata Sandi</Label>
                                <PasswordInput
                                    id="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Kata Sandi"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">
                                    Konfirmasi Kata Sandi
                                </Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Konfirmasi Kata Sandi"
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <input type="hidden" name="role" value={role} />

                            <Button
                                type="submit"
                                className="mt-2 w-full"
                                tabIndex={6}
                                data-test="register-user-button"
                            >
                                {processing && <Spinner />}
                                Buat akun
                            </Button>
                        </div>

                        <div className="flex flex-col items-center gap-4">
                            <div className="text-center text-sm text-muted-foreground">
                                Sudah punya akun?{' '}
                                <TextLink href={login()} tabIndex={7}>
                                    Masuk
                                </TextLink>
                            </div>
                            
                            <div className="text-center text-sm text-muted-foreground">
                                Ingin mendaftar sebagai {role === 'user' ? 'penyelenggara' : 'peserta'}?{' '}
                                <button
                                    type="button"
                                    tabIndex={8}
                                    onClick={() => setRole(role === 'user' ? 'organizer' : 'user')}
                                    className="underline underline-offset-4 hover:text-primary transition-colors"
                                >
                                    Klik di sini
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

Register.layout = {
    title: 'Buat akun Anda',
    description: 'Masukkan informasi di bawah ini untuk membuat akun',
};
