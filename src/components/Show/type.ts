type Key = number | string;

export interface IRenderMesh {
  geometry?: THREE.SphereGeometry;
  material?: THREE.MeshLambertMaterial;
  mesh?: THREE.Mesh;
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
}
