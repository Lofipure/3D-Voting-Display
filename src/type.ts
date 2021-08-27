type Key = number | string;

export interface IRenderMesh {
  geometry?: THREE.BoxGeometry;
  material?: THREE.MeshLambertMaterial;
  mesh?: THREE.Mesh;
  currentHeight?: number;
}

export interface IData {
  name: string;
  options: IOption[];
}

export interface IOption {
  label: string;
  selectionResult: ISelection[];
}

export interface ISelection extends IRenderMesh {
  id: Key;
  label: string;
  selectedNumber: number;
}

export interface IGlobalShowOptions extends IData {
  backgroundColor: string;
  container: HTMLDivElement;
  onComplete: (
    list: Array<
      ISelection & {
        optionName: string;
      }
    >,
  ) => void;
}

export interface IGlobal {
  remove: () => void;
}
