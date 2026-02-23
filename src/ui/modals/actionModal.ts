import { Modal } from "obsidian";
import type { CineVaultSearchItem } from "../../types/cinevault";
import { nullSafe } from "src/utils/helpers";

export class CineVaultMovieActionModal extends Modal {
  private movie: CineVaultSearchItem;
  private onSave: (watched: boolean) => void;

  constructor(app: Modal["app"], movie: CineVaultSearchItem, onSave: (watched: boolean) => void) {
    super(app);
    this.movie = movie;
    this.onSave = onSave;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();

    const modalContainer = contentEl.createDiv({
      cls: "obs-plugin-boxoffice-modal-detail-container"
    });

    const modalHeader = modalContainer.createDiv({
      cls: "obs-plugin-boxoffice-modal-detail-header"
    });

    const modalTitleContainer = modalHeader.createDiv({
      cls: "obs-plugin-boxoffice-modal-detail-title-container"
    });

    modalTitleContainer.createEl("h1", {
      text: this.movie.title,
      cls: "obs-plugin-boxoffice-modal-detail-title"
    });

    // Year and Type
    const type = nullSafe(() => this.movie.type[0].toUpperCase() + this.movie.type.slice(1), null);
    const year = nullSafe(() => this.movie.year, null);

    modalTitleContainer.createEl("p", {
      text: `${year} - ${type}`,
    });

    // Poster
    if (this.movie.poster) {
      modalHeader.createEl("img", { cls: "obs-plugin-boxoffice-modal-detail-poster" }).setAttribute("src", this.movie.poster);
    }

    const actions = contentEl.createDiv({ cls: "obs-plugin-boxoffice-modal-detail-actions" });
    const watchedButton = actions.createEl(
      "button",
      {
        text: "Mark as watched"
      });
    const toWatchButton = actions.createEl(
      "button",
      {
        text: "To watch"
      });

    watchedButton.addEventListener("click", () => {
      this.onSave(true);
      this.close();
    });

    toWatchButton.addEventListener("click", () => {
      this.onSave(false);
      this.close();
    });
  }
}
