import ThreeDLetterSwap from "../3d-letter-swap";

interface Props {
  texto: string;
}

/** El componente ya trae `respectReducedMotion` activo por defecto, así que
    no hace falta envolverlo como a los demás. */
export default function TitularSwap({ texto }: Props) {
  return (
    <ThreeDLetterSwap as="span" className="block text-tinta" staggerInterval={0.02}>
      {texto}
    </ThreeDLetterSwap>
  );
}
