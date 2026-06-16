import {
  useEffect,
  useState,
} from "react";

function useSidebar() {
  const [collapsed, setCollapsed] =
    useState(false);

  /* ========================= */
  /* LOAD STATE */
  /* ========================= */

  useEffect(() => {
    const storedState =
      localStorage.getItem(
        "sidebar_collapsed",
      );

    if (storedState) {
      setCollapsed(
        JSON.parse(storedState),
      );
    }
  }, []);

  /* ========================= */
  /* SAVE STATE */
  /* ========================= */

  useEffect(() => {
    localStorage.setItem(
      "sidebar_collapsed",
      JSON.stringify(collapsed),
    );
  }, [collapsed]);

  /* ========================= */
  /* TOGGLE */
  /* ========================= */

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  return {
    collapsed,

    toggleSidebar,
  };
}

export default useSidebar;