import { describe, expect, it } from "vitest";
import {
  accessFromSnapshot,
  isAdminEmail,
  normalizeEmail,
  parseEmails,
} from "./access";

describe("e-mails de acesso", () => {
  it("normaliza o e-mail que veio do Google ou da lista", () => {
    expect(normalizeEmail("  GuilhermeFaaga@Gmail.com ")).toBe(
      "guilhermefaaga@gmail.com"
    );
    expect(normalizeEmail(null)).toBe("");
  });

  it("reconhece administradoras sem diferenciar maiúsculas", () => {
    expect(isAdminEmail("GUILHERMEFAAGA@gmail.com")).toBe(true);
    expect(isAdminEmail("outra@gmail.com")).toBe(false);
    expect(isAdminEmail("")).toBe(false);
  });

  it("lê vários e-mails, remove repetidos e aponta os inválidos", () => {
    expect(
      parseEmails(
        "Ana@Exemplo.com, bia@exemplo.com\nana@exemplo.com; sem-arroba, c@x"
      )
    ).toEqual({
      emails: ["ana@exemplo.com", "bia@exemplo.com"],
      invalid: ["sem-arroba", "c@x"],
    });
  });

  it("não confirma acesso a partir de um documento ausente em cache", () => {
    expect(accessFromSnapshot(true, true)).toBe("granted");
    expect(accessFromSnapshot(true, false)).toBe("granted");
    expect(accessFromSnapshot(false, false)).toBe("denied");
    expect(accessFromSnapshot(false, true)).toBe("unknown");
  });
});
