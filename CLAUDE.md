# Syntax und Struktur

Dies ist KEINE Codebase, sondern eine Wissensbasis, die aus Markdown-Dateien besteht, die wir **Notizen**
nennen. Eine Notiz ist eine atomare Wissens-Einheit, die mit anderen Notizen verlinkt ist.

Interne Links sind relativ zur referenzierenden Notiz. Absolute Links sind ebenfalls möglich und beginnen dann
mit einem Slash (/). Sie werden dann relativ zur Repository Root interpretiert.

Die Wissensbasis hat automatische Qualitätschecks für Formatierung und Markdown-Struktur. Verwende die
folgenden Make-Targets:

- `make` oder `make check` - Prüft Formatierung und Markdown-Qualität ohne Änderungen
- `make format` - Formatiert alle Markdown-Dateien automatisch
- `make lint-fix` - Behebt automatisch behebbare Markdown-Probleme

**WICHTIG für AI-Agenten**: Führe nach jeder Änderung an Markdown-Dateien automatisch `make format` und
`make check` aus, um Formatierung zu normalisieren und Fehler zu erkennen. Diese Tools sind bereits
konfiguriert und sollten proaktiv verwendet werden.

Diese Wissensbasis ist kein Handbuch, daher wird hieraus auch kein HTML oder PDF produziert. Stattdessen wird
sie entweder direkt gelesen oder von AI-Agenten verarbeitet.

# Inhaltlicher Aufbau und Konventionen

Jede Notiz beginnt mit YAML Frontmatter. Wir nutzen die Felder "tags", "maturity" und "source".

- **tags**: Tags, die die Notiz klassifizieren. Die verwendeten Tags und ihre Bedeutung stehen in [Tags.md].
- **maturity**: Definiert der Reifegrad des Inhalts. Es gibt folgende Werte
  - 0-unchecked: Das hat noch nie ein Mensch gelesen, der sich auskennt
  - 1-checked: Die inhaltliche Richtigkeit wurde grob geprüft.
  - 2-mature: Die Informationen sind korrekt und nützlich.
  - 3-nugget: Diese Notiz ist inhaltlich sehr gut und besonders wichtig oder nützlich.
- **source** (optional): Gibt eine URL an, die die Quelle der Notiz ist. Dies wird verwendet, wenn sie aus
  einem anderen System importiert wurde.

Namenskonventionen für Dateien: Die Dateinamen sind die Titel direkt mit der Endung `.md`. Aus einem Titel
"Fachliche Grundlagen" wird also "Fachliche Grundlagen.md". Großschreibung, Leerzeichen, Umlaute und andere
Sonderzeichen werden beibehalten. Nur Slashes (`/`) sind in Notiztiteln nicht erlaub, da sie keine gültigen
Dateinamen sind.

# Pflege

Es ist Aufgabe des Projektteams, diese Wissensbasis auf einem gültigen Stand zu halten und die
Maturity-Einstufung korrekt zu machen. Informationen, die nicht oder nicht mehr stimmen gehören gelöscht.
Informationen, die man gestimmt haben und für ein historisches Verständnis vielleicht noch relevant sind,
müssen entsprechend markiert sein.
