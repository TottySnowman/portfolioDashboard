export const loadIcon = async (iconName: string) => {
  if (iconName == null || iconName.length == 0) {
    return (await import("react-icons/bs")).BsImageFill;
  }
  try {
    if (iconName.startsWith("Gr")) {
      return (await import("react-icons/gr"))[iconName];
    } else if (iconName.startsWith("Fa")) {
      return (await import("react-icons/fa"))[iconName];
    } else if (iconName.startsWith("Si")) {
      return (await import("react-icons/si"))[iconName];
    } else if (iconName.startsWith("Ai")) {
      return (await import("react-icons/ai"))[iconName];
    } else if (iconName.startsWith("Tb")) {
      return (await import("react-icons/tb"))[iconName];
    } else if (iconName.startsWith("Bs")) {
      return (await import("react-icons/bs"))[iconName];
    }

    console.warn(`Icon ${iconName} not found, using default icon.`);
    return (await import("react-icons/bs")).BsImageFill;
  } catch (error) {
    console.error(`Error loading icon: ${iconName}`, error);
    return (await import("react-icons/bs")).BsImageFill;
  }
};
