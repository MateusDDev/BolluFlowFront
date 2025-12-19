'use client'

import { GalleryVerticalEnd } from 'lucide-react'

import { cn } from 'lib/utils'
import { Button } from 'ui/button'
import { Input } from 'ui/input'
import { Label } from 'ui/label'
import { useLogin } from '@/features/login/hooks/mutations/useLogin'
import React, { useState } from 'react'

export function LoginForm() {
    const { mutateAsync: login, isPending, error } = useLogin()

    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        await login({ email, password })
    }

    return (
        <div className={cn('flex flex-col gap-6')}>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md">
                            <GalleryVerticalEnd className="size-6" />
                        </div>

                        <h1 className="text-xl font-bold">BolluFlow</h1>
                        <p className="text-center text-sm">
                            Sistema para administração de docerias
                        </p>
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="email@exemplo.com"
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
                                placeholder="Senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-red-500">
                                {(error as Error).message}
                            </p>
                        )}

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isPending}
                        >
                            {isPending ? 'Carregando...' : 'Login'}
                        </Button>
                    </div>
                </div>
            </form>

            <div className="text-balance text-center text-xs text-muted-foreground">
                By clicking login, you agree to our{' '}
                <a
                    href="#"
                    className="underline underline-offset-4 hover:text-primary"
                >
                    Terms of Service
                </a>{' '}
                and{' '}
                <a
                    href="#"
                    className="underline underline-offset-4 hover:text-primary"
                >
                    Privacy Policy
                </a>
                .
            </div>
        </div>
    )
}
