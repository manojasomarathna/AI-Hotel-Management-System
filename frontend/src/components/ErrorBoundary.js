import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: false }; // Don't crash the UI
  }

  componentDidCatch() {
    // Silently ignore
  }

  render() {
    return this.props.children;
  }
}
