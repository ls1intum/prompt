import React, { useContext } from 'react'
import { SampleInputContext } from 'shared-library'

const App = (): JSX.Element => {
  const { inputText, updateInputText } = useContext(SampleInputContext)

  return (
    <>
      <h1>Sample Component</h1>

      <div>
        {inputText}
        <p>Hallo</p>
      </div>
    </>
  )
}

export default App
