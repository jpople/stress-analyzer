import { ReactNode, useState } from 'react';
import './App.css'
import { ChakraProvider, Checkbox, Code, Container, HStack, Text, Textarea, VStack } from '@chakra-ui/react'

import dictJson from './assets/dict.json';
import { MinusIcon, TriangleDownIcon, TriangleUpIcon, WarningIcon } from '@chakra-ui/icons';

interface IDictionary {
  [word: string]: string;
}

interface StressDict {
  [char: string]: ReactNode;
}

const App = () => {

  const dict = dictJson as IDictionary;

  const [input, setInput] = useState<string>('');
  const [isWordAligned, setIsWordAligned] = useState<boolean>(true);

  const inputLines = input.split("\n");
  const inputWords = inputLines.map((line) => line.split(' '));

  const Line = ({ words }: { words: string[] }) => {
    return isWordAligned ? <HStack spacing={2} wrap="wrap">
      {words.map((word) => <WordDisplay word={word} />)}
    </HStack>
      : <VStack>
        <HStack spacing={2}>
          {words.map((word) => <StressIndicator word={word} />)}
        </HStack>
        <HStack>
          {words.map((word) => <Word word={word} />)}
        </HStack>
      </VStack>
  }

  const StressIndicator = ({ word }: { word: string }) => {
    const stressCode = findWordStress(word);
    const stressLookup: StressDict = {
      "_": <MinusIcon color="gray.400" />,
      "'": <TriangleUpIcon color="purple" />,
      "`": <TriangleDownIcon color="blue.200" />,
    }
    return <HStack spacing={1}>
      {stressCode.split("").map((char) => (char in stressLookup) ? stressLookup[char] : <WarningIcon color="red.400" />)}
    </HStack >
  }

  const WordDisplay = ({ word }: { word: string }) => {
    return <VStack>
      <StressIndicator word={word} />
      <Word word={word} />
    </VStack>
  }

  const Word = ({ word }: { word: string }) => {
    const splitWord = word.split("\\");
    const wordToShow = splitWord.length > 1 ? splitWord[0] : word;
    return <Text>{wordToShow}</Text>
  }

  const findWordStress = (word: string) => {
    if (!word) {
      return "";
    }
    if (word.split("\\").length > 1) {
      return word.split("\\")[1];
    }
    const lower = word.toLocaleLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()—]/g, "");
    if (!(lower in dict)) {
      return "X";
    }
    return dict[lower];
  }

  return (
    <ChakraProvider>
      <Container justifyContent="start" maxW="3xl">
        <VStack spacing={6}>
          <Text>
            To override the default stress pattern or provide a stress pattern for a word not in the dictionary (marked by <WarningIcon color="red.400" />), follow the word with a <Code>\</Code> and then the stress pattern you want to use as text; <Code>_</Code> represents an unstressed syllable, <Code>'</Code> a syllable with primary stress, and <Code>`</Code> (a backtick) a syllable with secondary stress.  For instance, typing <Code>Cimorene\'_`</Code> will render:
          </Text>
          <WordDisplay word="Cimorene\'_`" />
          <Textarea value={input} minH={24} onChange={(e) => setInput(e.target.value)} />
          <Checkbox isChecked={isWordAligned} onChange={(e) => setIsWordAligned(e.target.checked)}>Align to words</Checkbox>
          <VStack maxW="720px" spacing={4} align="start">
            {inputWords.map((line) => <Line words={line} />)}
          </VStack>
        </VStack>
      </Container>
    </ChakraProvider >
  )
}

export default App
