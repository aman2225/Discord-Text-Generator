"use client";

import { useState, useRef, useEffect } from "react";
import { MantineProvider, useMantineColorScheme, Notification, Text } from "@mantine/core";
import { Popover, Group, ActionIcon, Button, Divider } from "@mantine/core";
import { IconUnderline, IconBold, IconTrash, IconChevronDown, IconSun, IconMoon, IconCheck, IconCopy } from "@tabler/icons-react";
import { useTimeout } from '@mantine/hooks';

export default function DiscordTextGenerator() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  const [foregroundColor, setForegroundColor] = useState("#ffffff");
  const [backgroundColor, setBackgroundColor] = useState("#1A1B1E");
  const [fgPickerOpened, setFgPickerOpened] = useState(false);
  const [bgPickerOpened, setBgPickerOpened] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const { start, clear } = useTimeout(() => setShowNotification(false), 2000);

  const editorRef = useRef(null);
  const fgButtonRef = useRef(null);
  const bgButtonRef = useRef(null);
  const fgPopoverRef = useRef(null);
  const bgPopoverRef = useRef(null);

  const themeColors = [
    "#ffffff", "#000000", "#EEECE1", "#1F497D", "#4F81BD", 
    "#C0504D", "#9BBB59", "#8064A2", "#4BACC6", "#F79646"
  ];

  const standardColors = [
    "#C00000", "#FF0000", "#FFC000", "#FFFF00", "#92D050",
    "#00B050", "#00B0F0", "#0070C0", "#002060", "#7030A0"
  ];

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.focus();
      editorRef.current.innerHTML = "Welcome to <strong>Discord</strong> Colored Text Generator!";
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fgPickerOpened && 
          fgButtonRef.current && 
          !fgButtonRef.current.contains(event.target) &&
          fgPopoverRef.current &&
          !fgPopoverRef.current.contains(event.target)) {
        setFgPickerOpened(false);
      }
      
      if (bgPickerOpened && 
          bgButtonRef.current && 
          !bgButtonRef.current.contains(event.target) &&
          bgPopoverRef.current &&
          !bgPopoverRef.current.contains(event.target)) {
        setBgPickerOpened(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [fgPickerOpened, bgPickerOpened]);

  const applyColor = (color, type) => {
    document.execCommand(type === "fg" ? "foreColor" : "backColor", false, color);
    if (type === "fg") setForegroundColor(color);
    else setBackgroundColor(color);
    if (type === "fg") setFgPickerOpened(false);
    else setBgPickerOpened(false);
  };

  const applyFormatting = (format) => {
    document.execCommand(format === "bold" ? "bold" : "underline", false, null);
  };

  const resetAll = () => {
    if (editorRef.current) {
      editorRef.current.innerHTML = "Welcome to <strong>Discord</strong> Colored Text Generator!";
      setForegroundColor("#ffffff");
      setBackgroundColor("#1A1B1E");
      setCopySuccess(false);
    }
  };

  // ... (keep all your color arrays and other existing code)

  const copyToClipboard = async () => {
    if (!editorRef.current) return;

    function nodesToANSI(nodes, states) {
      let text = ""
      for (const node of nodes) {
          if (node.nodeType === 3) {
              text += node.textContent;
              continue;
          }
          if (node.nodeName === "BR") {
              text += "\n";
              continue;   
          }
          const ansiCode = +(node.className.split("-")[1]);
          const newState = Object.assign({}, states.at(-1));

          if (ansiCode < 30) newState.st = ansiCode;
          if (ansiCode >= 30 && ansiCode < 40) newState.fg = ansiCode;
          if (ansiCode >= 40) newState.bg = ansiCode;

          states.push(newState)
          text += `\x1b[${newState.st};${(ansiCode >= 40) ? newState.bg : newState.fg}m`;
          text += nodesToANSI(node.childNodes, states);
          states.pop()
          text += `\x1b[0m`;
          if (states.at(-1).fg !== 2) text += `\x1b[${states.at(-1).st};${states.at(-1).fg}m`;
          if (states.at(-1).bg !== 2) text += `\x1b[${states.at(-1).st};${states.at(-1).bg}m`;
      }
      return text;
  }

    try {
      const toCopy = "```ansi\n" + nodesToANSI(editorRef.current.childNodes, [{ fg: 2, bg: 2, st:2 }]) + "\n```";
      await navigator.clipboard.writeText(toCopy);
      setCopySuccess(true);
      setShowNotification(true);
      start(); // Auto-hide notification after 2 seconds
      
      // Reset button state after 2 seconds
      setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };
  
    // ... (keep your existing traverseNodes implementation)

  //   try {
  //     await navigator.clipboard.writeText(discordFormattedText);
  //     setShowNotification(true);
  //     start();
  //   } catch (err) {
  //     console.error('Failed to copy text: ', err);
  //   }
  // };


  const convertColorToAnsi = (color) => {
    const colorMap = {
      "#ffffff": 15, "#000000": 0, "#EEECE1": 255, "#1F497D": 24, "#4F81BD": 33,
      "#C0504D": 160, "#9BBB59": 70, "#8064A2": 97, "#4BACC6": 38, "#F79646": 214,
      "#C00000": 196, "#FF0000": 9, "#FFC000": 220, "#FFFF00": 11, "#92D050": 118,
      "#00B050": 34, "#00B0F0": 39, "#0070C0": 32, "#002060": 17, "#7030A0": 55
    };
    return colorMap[color] || 15;
  };

  // ... (keep all your other existing functions)

  return (
    <MantineProvider theme={{ colorScheme, defaultColorScheme: 'dark' }}>
      <div style={{ 
        maxWidth: "600px", 
        margin: "auto", 
        padding: "20px", 
        textAlign: "center",
        backgroundColor: dark ? "#1A1B1E" : "#FFFFFF",
        color: dark ? "#FFFFFF" : "#000000",
        minHeight: "100vh",
        transition: "background 0.3s ease",
        position: 'relative'
      }}>
        {showNotification && (
          <Notification
            icon={<IconCheck size="1.1rem" />}
            color="teal"
            title="Copied to clipboard!"
            style={{
              position: 'fixed',
              bottom: 20,
              right: 20,
              zIndex: 1000,
              width: 'auto'
            }}
            onClose={() => setShowNotification(false)}
          >
            Your formatted text is ready to paste into Discord
          </Notification>
        )}

<Group position="apart" mb="md">
          <h1>
            <strong>Discord</strong> <span style={{ color: "#4DABF7" }}>Colored</span> Text Generator
          </h1>
          <ActionIcon 
            onClick={() => toggleColorScheme()}
            size="lg"
            variant="outline"
            color={dark ? "yellow" : "blue"}
          >
            {dark ? <IconSun size={20} /> : <IconMoon size={20} />}
          </ActionIcon>
        </Group>

        <p style={{ color: dark ? "#CED4DA" : "#495057" }}>
        This app lets you create colorful Discord messages using ANSI color codes supported in the latest desktop version.
        </p>
        <p style={{ color: dark ? "#CED4DA" : "#495057" }}>
        Simply type your message, highlight sections, apply colors, and copy the formatted text with a click. Then, paste it into Discord to send a vibrant message!
        </p>
        
        <h3 style={{ color: dark ? "#E9ECEF" : "#212529" }}>Source Code</h3>
        <p style={{ color: dark ? "#CED4DA" : "#495057" }}>
          This app runs entirely in your browser and the source code is freely available on <a href="https://github.com/aman2225/Discord-Text-Generator" style={{ color: "#4DABF7" }}>GitHub</a>.
        </p>
        
        <h3 style={{ color: dark ? "#E9ECEF" : "#212529" }}>Create your text</h3>
        <Divider my="sm" style={{ borderColor: dark ? "#373A40" : "#DEE2E6" }} />

        <Group spacing="xs" style={{ justifyContent: "center", marginTop: "15px" }}>
          <Button variant="light" leftIcon={<IconTrash size={16} />} onClick={resetAll} compact>
            Reset All
          </Button>
          <Button variant="light" leftIcon={<IconBold size={16} />} onClick={() => applyFormatting("bold")} compact>
            Bold
          </Button>
          <Button variant="light" leftIcon={<IconUnderline size={16} />} onClick={() => applyFormatting("underline")} compact>
            Underline
          </Button>
        </Group>

        <Group spacing="xs" style={{ justifyContent: "center", marginTop: "15px" }}>
          <Popover 
            opened={fgPickerOpened} 
            onClose={() => setFgPickerOpened(false)} 
            position="bottom" 
            withArrow
            withinPortal
          >
            <Popover.Target>
              <Button 
                ref={fgButtonRef}
                variant="light" 
                rightIcon={<IconChevronDown size={16} />}
                onClick={() => { setFgPickerOpened((o) => !o); setBgPickerOpened(false); }}
                compact
              >
                <div style={{ 
                  width: "16px", 
                  height: "16px", 
                  backgroundColor: foregroundColor, 
                  border: dark ? "1px solid #495057" : "1px solid #CED4DA", 
                  marginRight: "8px" 
                }} />
                FG
              </Button>
            </Popover.Target>
            <Popover.Dropdown ref={fgPopoverRef}>
              <Group spacing="xs">
                {themeColors.map((color) => (
                  <ActionIcon 
                    key={color} 
                    style={{
                      backgroundColor: color, 
                      width: "20px", 
                      height: "20px",
                      borderRadius: "4px", 
                      cursor: "pointer",
                      border: foregroundColor === color ? "2px solid #4DABF7" : dark ? "1px solid #495057" : "1px solid #CED4DA",
                    }} 
                    onClick={() => applyColor(color, 'fg')} 
                  />
                ))}
              </Group>
            </Popover.Dropdown>
          </Popover>

          <Popover 
            opened={bgPickerOpened} 
            onClose={() => setBgPickerOpened(false)} 
            position="bottom" 
            withArrow
            withinPortal
          >
            <Popover.Target>
              <Button 
                ref={bgButtonRef}
                variant="light" 
                rightIcon={<IconChevronDown size={16} />}
                onClick={() => { setBgPickerOpened((o) => !o); setFgPickerOpened(false); }}
                compact
              >
                <div style={{ 
                  width: "16px", 
                  height: "16px", 
                  backgroundColor: backgroundColor, 
                  border: dark ? "1px solid #495057" : "1px solid #CED4DA", 
                  marginRight: "8px" 
                }} />
                BG
              </Button>
            </Popover.Target>
            <Popover.Dropdown ref={bgPopoverRef}>
              <Group spacing="xs">
                {standardColors.map((color) => (
                  <ActionIcon 
                    key={color} 
                    style={{
                      backgroundColor: color, 
                      width: "20px", 
                      height: "20px",
                      borderRadius: "4px", 
                      cursor: "pointer",
                      border: backgroundColor === color ? "2px solid #4DABF7" : dark ? "1px solid #495057" : "1px solid #CED4DA",
                    }} 
                    onClick={() => applyColor(color, 'bg')} 
                  />
                ))}
              </Group>
            </Popover.Dropdown>
          </Popover>
        </Group>

        <Divider my="sm" style={{ borderColor: dark ? "#373A40" : "#DEE2E6" }} />

        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          style={{
            width: "100%",
            minHeight: "100px",
            margin: "10px 0 20px",
            padding: "10px",
            border: dark ? "1px solid #495057" : "1px solid #CED4DA",
            borderRadius: "4px",
            textAlign: "left",
            backgroundColor: dark ? "#25262B" : "#FFFFFF",
            color: dark ? "#E9ECEF" : "#212529",
            transition: "background 0.3s ease, color 0.3s ease",
            outline: "none"
          }}
        />


        {/* ... (keep all your existing JSX) */}

        <Button
  color={copySuccess ? "teal" : "blue"}
  style={{ marginTop: "10px" }} 
  onClick={copyToClipboard}
  leftIcon={<IconCopy size={18} />}
>
  {copySuccess ? "Copied!" : "Copy to Discord"}
</Button>

        {/* <Button
          color="blue"
          style={{ marginTop: "10px" }} 
          onClick={copyToClipboard}
          leftIcon={<IconCopy size={18} />}
        >
          Copy to Discord
        </Button> */}
      </div>
    </MantineProvider>
  );
}