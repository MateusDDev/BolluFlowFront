'use client'

import Link from 'next/link'
import React, { useState } from 'react'
import { Button } from 'ui/button'
import { Input } from 'ui/input'
import { Label } from 'ui/label'
import { AuthHeader } from '@/features/login/components/AuthHeader'
import { useSignUp } from '@/features/login/hooks/mutations/useSignUp'

const MINIMUM_PASSWORD_LENGTH = 8

export function SignUpForm() {
    const { mutateAsync: signUp, isPending, error } = useSignUp()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const isPasswordTooShort =
        password.length > 0 && password.length < MINIMUM_PASSWORD_LENGTH

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        await signUp({ name: name.trim(), email: email.trim(), password })
    }

    return (
        <div className="flex flex-col gap-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <AuthHeader subtitle="Crie sua conta grátis em menos de um minuto" />

                <div className="grid gap-2">
                    <Label htmlFor="name">Nome do negócio</Label>
                    <Input
                        id="name"
                        placeholder="Doceria da Ana"
                        autoComplete="organization"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        minLength={2}
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="email@exemplo.com"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder={`Mínimo de ${MINIMUM_PASSWORD_LENGTH} caracteres`}
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={MINIMUM_PASSWORD_LENGTH}
                    />
                    {isPasswordTooShort && (
                        <p className="text-muted-foreground text-xs">
                            Faltam {MINIMUM_PASSWORD_LENGTH - password.length}{' '}
                            caracteres
                        </p>
                    )}
                </div>

                {error && (
                    <p className="text-sm text-red-500">
                        {(error as Error).message}
                    </p>
                )}

                <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? 'Criando conta...' : 'Criar conta'}
                </Button>
            </form>

            <p className="text-muted-foreground text-center text-sm">
                Já tem conta?{' '}
                <Link
                    href="/login"
                    className="hover:text-primary underline underline-offset-4"
                >
                    Entrar
                </Link>
            </p>
        </div>
    )
}
