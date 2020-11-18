import { Conductor } from '../core/conductor';
import { Playground } from '../state/playground';
import { hookUpConductors } from './message';

export function downloadFile(name: string, blob: Blob) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  // the filename you want
  a.download = name;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
}

export function fileToPlayground(json): Playground {
  const conductors = json.conductors.map((c) => new Conductor(c));
  hookUpConductors(conductors);
  return {
    ...json,
    conductors,
  };
}
