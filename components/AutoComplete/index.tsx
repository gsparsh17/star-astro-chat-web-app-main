import React, { useRef, useState } from "react"

const KEY_CODES = {
  DOWN: 40,
  UP: 38,
  PAGE_DOWN: 34,
  ESCAPE: 27,
  PAGE_UP: 33,
  ENTER: 13,
}

type suggestion = {
  label: String
  value: String
}

type autoCompleteInput = {
  source: Function
  onChange: Function
  delay: number
}
export default function useAutoComplete({
  delay = 500,
  source,
  onChange,
}: autoCompleteInput) {
  const [myTimeout, setMyTimeOut] = useState(setTimeout(() => {}, 0))
  const listRef = useRef<Array<HTMLElement>>()
  const [suggestions, setSuggestions] = useState<Array<suggestion>>([])
  const [isBusy, setBusy] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState<number>(-1)
  const [textValue, setTextValue] = useState<String>("")

  function delayInvoke(cb: { (): void; (): void }) {
    if (myTimeout) {
      clearTimeout(myTimeout)
    }
    setMyTimeOut(setTimeout(cb, delay))
  }

  function selectOption(index: number) {
    if (index > -1) {
      onChange(suggestions[index])
      setTextValue(suggestions[index].label)
    }
    clearSuggestions()
  }

  async function getSuggestions(searchTerm: any) {
    if (searchTerm && source) {
      const options = await source(searchTerm)
      setSuggestions(options)
    }
  }

  function clearSuggestions() {
    setSuggestions([])
    setSelectedIndex(-1)
  }

  function onTextChange(searchTerm: string) {
    setBusy(true)
    setTextValue(searchTerm)
    clearSuggestions()
    delayInvoke(() => {
      getSuggestions(searchTerm)
      setBusy(false)
    })
  }
  // @ts-ignore
  const optionHeight = listRef?.current?.children[0]?.clientHeight

  function scrollUp() {
    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1)
    }
    // @ts-ignore
    listRef.current.scrollTop -= optionHeight
  }

  function scrollDown() {
    if (selectedIndex < suggestions.length - 1) {
      setSelectedIndex(selectedIndex + 1)
    }
    // @ts-ignore
    listRef.current.scrollTop = selectedIndex * optionHeight
  }

  function pageDown() {
    setSelectedIndex(suggestions.length - 1)
    // @ts-ignore
    listRef.current.scrollTop = suggestions.length * optionHeight
  }

  function pageUp() {
    setSelectedIndex(0)
    // @ts-ignore
    listRef.current.scrollTop = 0
  }

  function onKeyDown(e: { keyCode: string | number }) {
    const keyOperation = {
      [KEY_CODES.DOWN]: scrollDown,
      [KEY_CODES.UP]: scrollUp,
      [KEY_CODES.ENTER]: () => selectOption(selectedIndex),
      [KEY_CODES.ESCAPE]: clearSuggestions,
      [KEY_CODES.PAGE_DOWN]: pageDown,
      [KEY_CODES.PAGE_UP]: pageUp,
    }
    // @ts-ignore
    if (keyOperation[e.keyCode]) {
      // @ts-ignore
      keyOperation[e.keyCode]()
    } else {
      setSelectedIndex(-1)
    }
  }

  return {
    bindOption: {
      onClick: (e: { target: { closest: (arg0: string) => unknown } }) => {
        // @ts-ignore
        let nodes = Array.from(listRef.current.children)
        selectOption(nodes.indexOf(e.target.closest("li")))
      },
    },
    bindInput: {
      value: textValue,
      onChange: (e: { target: { value: any } }) => onTextChange(e.target.value),
      onKeyDown,
    },
    bindOptions: {
      ref: listRef,
    },
    isBusy,
    suggestions,
    selectedIndex,
    selectOption,
  }
}
