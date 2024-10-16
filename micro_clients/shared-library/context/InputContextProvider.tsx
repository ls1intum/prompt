import React, { createContext, ReactNode, useState } from 'react'

interface InputContextType {
    inputText: string;
    updateInputText: (text: string) => void;
}

export const SampleInputContext = createContext<InputContextType>({
    inputText: '',
    updateInputText: (text: string) => {}
})

interface InputContextProviderProps {
    children: ReactNode
}

export const SampleInputContextProvider = ({ children }: InputContextProviderProps): JSX.Element => {
    const [inputText, setInputText] = useState<string>('TEST');    
    const updateInputText = (text: string) => {
        setInputText(text);
    }

    return (
        <SampleInputContext.Provider value={{ inputText, updateInputText }}>
            {children}
        </SampleInputContext.Provider>
    )
}