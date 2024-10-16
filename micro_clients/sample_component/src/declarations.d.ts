declare module 'shared-library' {
  export const SampleInputContextProvider: ({ children }: InputContextProviderProps) => JSX.Element
  export const SampleInputContext: React.Context<InputContextType>
}
