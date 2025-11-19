// src/hooks/useDebounce.ts
import { useState, useEffect } from 'react';

// Este hook pega um valor que muda rapidamente (como o texto da busca)
// e só retorna a versão "estável" dele após um certo tempo de inatividade.
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Cria um temporizador que vai atualizar o valor debounced
    // apenas depois que o 'delay' passar.
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Isso é crucial: se o 'value' mudar (o usuário digitou outra letra),
    // nós cancelamos o temporizador anterior e criamos um novo.
    // Isso garante que a atualização só aconteça quando o usuário parar de digitar.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Roda o efeito novamente apenas se o valor ou o delay mudarem

  return debouncedValue;
}