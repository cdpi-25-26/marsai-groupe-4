import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import FilmCard from "../components/FilmCard";

const mockFilm = {
  id: 1,
  title: "Neural Odyssey",
  translated_title: "Odyssée Neurale",
  duration: "60s",
  synopsis: "Un court-métrage généré par IA.",
  status: "published",
  ai_tools: "Midjourney",
  youtube_link: "https://www.youtube.com/watch?v=abc123",
  thumbnail: "",
  image_2: "",
  image_3: "",
};

describe("FilmCard", () => {
  it("affiche le titre du film", () => {
    render(
      <MemoryRouter>
        <FilmCard film={mockFilm} />
      </MemoryRouter>
    );
    expect(screen.getByText("Neural Odyssey")).toBeInTheDocument();
  });

  it("affiche le titre traduit", () => {
    render(
      <MemoryRouter>
        <FilmCard film={mockFilm} />
      </MemoryRouter>
    );
    expect(screen.getByText("Odyssée Neurale")).toBeInTheDocument();
  });

  it("affiche le statut en badge", () => {
    render(
      <MemoryRouter>
        <FilmCard film={mockFilm} />
      </MemoryRouter>
    );
    expect(screen.getByText("PUBLISHED")).toBeInTheDocument();
  });

  it("affiche les outils IA", () => {
    render(
      <MemoryRouter>
        <FilmCard film={mockFilm} />
      </MemoryRouter>
    );
    expect(screen.getByText("Midjourney")).toBeInTheDocument();
  });

  it("retourne null si film est undefined", () => {
    const { container } = render(
      <MemoryRouter>
        <FilmCard film={null} />
      </MemoryRouter>
    );
    expect(container.firstChild).toBeNull();
  });
});
