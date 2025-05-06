import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";
import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import "@testing-library/jest-dom";

describe("Form Tests", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    console.log.mockRestore();
  });

  test("renders form fields and submit button", () => {
    render(<App />);
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/E-mail/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /REGISTER/i })).toBeInTheDocument();
  });

  test("submit with valid data works", () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: "John" } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: "Doe" } });
    fireEvent.change(screen.getByLabelText(/E-mail/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText(/Date of Birth/i), { target: { value: "01/01/2000" } });
    fireEvent.click(screen.getByRole("button", { name: /REGISTER/i }));
    expect(console.log).toHaveBeenCalled();
  });

  test("shows email error", async () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText(/E-mail/i), { target: { value: "invalid" } });
    fireEvent.click(screen.getByRole("button", { name: /REGISTER/i }));
    expect(await screen.findByText(/Invalid email format/i)).toBeInTheDocument();
  });

  test("shows password error", async () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: "123" } });
    fireEvent.click(screen.getByRole("button", { name: /REGISTER/i }));
    expect(await screen.findByText(/Password must be at least 8 characters/i)).toBeInTheDocument();
  });

  test("shows password mismatch error", async () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: "different" } });
    fireEvent.click(screen.getByRole("button", { name: /REGISTER/i }));
    expect(await screen.findByText(/Passwords do not match/i)).toBeInTheDocument();
  });

  test("shows date format error", async () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText(/Date of Birth/i), { target: { value: "1-1-2000" } });
    fireEvent.click(screen.getByRole("button", { name: /REGISTER/i }));
    expect(await screen.findByText(/Date of Birth must be in dd\/mm\/yyyy format/i)).toBeInTheDocument();
  });

  test("shows success message", () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: "Ali" } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: "Veli" } });
    fireEvent.change(screen.getByLabelText(/E-mail/i), { target: { value: "ali@example.com" } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText(/Date of Birth/i), { target: { value: "10/10/1990" } });
    fireEvent.click(screen.getByRole("button", { name: /REGISTER/i }));
    expect(screen.getByText(/Registration Successful!/i)).toBeInTheDocument();
  });

  test("reset button works", () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: "Test" } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: "User" } });
    fireEvent.change(screen.getByLabelText(/E-mail/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText(/Date of Birth/i), { target: { value: "01/01/2000" } });
    fireEvent.click(screen.getByRole("button", { name: /REGISTER/i }));
    fireEvent.click(screen.getByText(/Create Another Account/i));
    expect(screen.getByRole("button", { name: /REGISTER/i })).toBeInTheDocument();
  });
});