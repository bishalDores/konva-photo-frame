import { observable, action, computed, makeObservable } from "mobx";

export class Store {
  aspectRatio = 16 / 9;
  sidebarWidth = 250;
  pad = 50;
  win = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  constructor() {
    makeObservable(this, {
      aspectRatio: observable,
      sidebarWidth: observable,
      pad: observable,
      win: observable,
      canvas: computed,
      browser: computed,
      updateWin: action.bound,
      destroyWin: observable,
    });

    window.addEventListener("resize", this.updateWin);
  }

  get canvas() {
    const width = this.win.width - this.sidebarWidth - this.pad;
    const height = this.win.height;

    return {
      width,
      height,
    };
  }

  get browser() {
    const width = this.canvas.width - this.pad;
    const height = width / this.aspectRatio;

    return {
      width,
      height,
    };
  }

  updateWin() {
    this.win.width = window.innerWidth;
    this.win.height = window.innerHeight;
  }

  destroyWin() {
    window.removeEventListener("resize", this.updateWin);
  }
}

export const store = new Store();
