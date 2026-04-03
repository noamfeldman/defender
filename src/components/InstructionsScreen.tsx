import React from 'react';
import { useIsMobile, useOrientation } from '../hooks/useMobileDetection';
import { Button } from './ui/Button';
import { PageTitle } from './ui/PageTitle';

interface Props {
    onPlay: () => void;
    onBack: () => void;
}

export const InstructionsScreen: React.FC<Props> = ({ onPlay, onBack }) => {
    const isMobile = useIsMobile();
    const orientation = useOrientation();
    const isLandscape = orientation === 'landscape';

    if (isMobile) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-start bg-black p-4 text-center tracking-widest gap-4 sm:gap-6 overflow-hidden selection:bg-[#00ffcc] selection:text-black font-sans landscape:pt-2">
                
                {/* Buttons at Top in Landscape */}
                {isLandscape && (
                    <div className="flex flex-row gap-3 w-full justify-center px-4 mb-2 shrink-0">
                        <div className="flex-[1.5] max-w-[160px]">
                            <Button
                                variant="primary"
                                onClick={onPlay}
                                fullWidth
                                className="h-8 text-[10px]"
                            >
                                START
                            </Button>
                        </div>
                        <div className="flex-1 max-w-[100px]">
                            <Button
                                variant="secondary"
                                onClick={onBack}
                                fullWidth
                                className="h-8 text-[10px]"
                            >
                                BACK
                            </Button>
                        </div>
                    </div>
                )}

                <PageTitle text="INSTRUCTIONS" as="h2" className="mb-1 landscape:text-lg landscape:mb-0" />

                <div className="flex flex-col gap-2 text-left w-full px-2 landscape:gap-1 overflow-y-auto">
                    <div className="flex-1 space-y-2 landscape:space-y-1">
                        <h3 className="text-lg text-[#ff0055] border-b border-[#ff0055] pb-1 uppercase landscape:text-sm landscape:border-none landscape:pb-0">MOBILE CONTROLS</h3>
                        <ul className="text-gray-300 space-y-1 text-[10px] sm:text-xs leading-tight landscape:text-[9px]">
                            <li className="flex flex-wrap items-start gap-2">
                                <span className="text-[#00ffcc] font-bold min-w-[90px] inline-block shrink-0 uppercase">L-SCREEN</span>
                                <span className="text-gray-500">|</span>
                                <span>DRAG TO FLY (JOYSTICK)</span>
                            </li>
                            <li className="flex flex-wrap items-start gap-2">
                                <span className="text-[#00ffcc] font-bold min-w-[90px] inline-block shrink-0 uppercase">R-SCREEN</span>
                                <span className="text-gray-500">|</span>
                                <span>TAP BUTTONS FOR ACTION</span>
                            </li>
                        </ul>

                        {!isLandscape && (
                            <div className="mt-2 p-3 border border-[#00ffcc]/30 bg-[#00ffcc]/5 rounded-lg">
                                <h4 className="text-[#00ffcc] font-bold mb-1 text-[10px] flex items-center gap-2 uppercase tracking-tighter">
                                    📱 MOBILE PRO-TIP
                                </h4>
                                <p className="text-[10px] text-gray-400 leading-tight">
                                    Rotate to <span className="text-white font-bold">LANDSCAPE</span>. Use left thumb to steer and right to blast!
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {!isLandscape && <div className="flex-1 min-h-[10px]" />}

                {/* Buttons at Bottom in Portrait */}
                {!isLandscape && (
                    <div className="mt-auto flex flex-row gap-3 w-full justify-center px-4 pb-4">
                        <div className="flex-[1.5] max-w-[200px]">
                            <Button
                                variant="primary"
                                onClick={onPlay}
                                fullWidth
                            >
                                START
                            </Button>
                        </div>
                        <div className="flex-1 max-w-[120px]">
                            <Button
                                variant="secondary"
                                onClick={onBack}
                                fullWidth
                            >
                                BACK
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Default Desktop View
    return (
        <div className="w-full h-full flex flex-col items-center justify-start bg-black p-6 md:p-10 text-center tracking-widest gap-10 md:gap-16 overflow-y-auto selection:bg-[#00ffcc] selection:text-black font-sans">
            <PageTitle text="MISSION PARAMETERS" as="h2" className="mt-4 mb-4 md:mb-10 tracking-[0.3em]" />

            <div className="flex flex-row gap-12 md:gap-24 text-left max-w-6xl w-full px-4 md:px-8">
                <div className="flex-1 space-y-4 md:space-y-6">
                    <h3 className="text-2xl md:text-3xl text-[#ff0055] border-b-2 border-[#ff0055] pb-2 md:pb-3 uppercase font-bold tracking-[0.2em]">PC PILOT</h3>
                    <ul className="text-gray-300 space-y-2 md:space-y-4 text-base md:text-lg leading-relaxed">
                        <li className="flex items-center gap-4">
                            <span className="text-white font-bold min-w-[120px] md:min-w-[140px] inline-block uppercase bg-white/5 px-2 py-1 rounded border border-white/10 text-center text-sm md:text-base">W A S D</span>
                            <span className="text-gray-600 font-light">|</span>
                            <span>STEER SPACECRAFT</span>
                        </li>
                        <li className="flex items-center gap-4">
                            <span className="text-white font-bold min-w-[120px] md:min-w-[140px] inline-block uppercase bg-white/5 px-2 py-1 rounded border border-white/10 text-center text-sm md:text-base">SPACE</span>
                            <span className="text-gray-600 font-light">|</span>
                            <span>PRIMARY CANNON</span>
                        </li>
                        <li className="flex items-center gap-4">
                            <span className="text-white font-bold min-w-[120px] md:min-w-[140px] inline-block uppercase bg-white/5 px-2 py-1 rounded border border-white/10 text-center text-sm md:text-base">SHIFT</span>
                            <span className="text-gray-600 font-light">|</span>
                            <span>ENGINE THRUST</span>
                        </li>
                        <li className="flex items-center gap-4">
                            <span className="text-white font-bold min-w-[120px] md:min-w-[140px] inline-block uppercase bg-white/5 px-2 py-1 rounded border border-white/10 text-center text-sm md:text-base">B / H</span>
                            <span className="text-gray-600 font-light">|</span>
                            <span>BOMBS / HYPER</span>
                        </li>
                    </ul>
                </div>

                <div className="flex-1 space-y-4 md:space-y-6">
                    <h3 className="text-2xl md:text-3xl text-[#00ffcc] border-b-2 border-[#00ffcc] pb-2 md:pb-3 uppercase font-bold tracking-[0.2em]">MOBILE LINK</h3>
                    <ul className="text-gray-300 space-y-2 md:space-y-4 text-base md:text-lg leading-relaxed">
                        <li className="flex items-center gap-4">
                            <span className="text-[#00ffcc] font-bold min-w-[120px] md:min-w-[140px] inline-block uppercase bg-[#00ffcc]/5 px-2 py-1 rounded border border-[#00ffcc]/20 text-center text-sm md:text-base">L-HALF</span>
                            <span className="text-gray-600 font-light">|</span>
                            <span>DRAG TO NAVIGATE</span>
                        </li>
                        <li className="flex items-center gap-4">
                            <span className="text-[#00ffcc] font-bold min-w-[120px] md:min-w-[140px] inline-block uppercase bg-[#00ffcc]/5 px-2 py-1 rounded border border-[#00ffcc]/20 text-center text-sm md:text-base">R-HALF</span>
                            <span className="text-gray-600 font-light">|</span>
                            <span>TAP FOR WEAPONS</span>
                        </li>
                    </ul>
                    
                    <div className="mt-6 md:mt-10 p-4 md:p-6 border-2 border-[#ff0055]/20 bg-[#ff0055]/5 rounded-2xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-[#ff0055]" />
                        <h4 className="text-[#ff0055] font-bold mb-1 text-base md:text-lg uppercase tracking-widest">
                            TACTICAL NOTE
                        </h4>
                        <p className="text-sm md:text-base text-gray-400 font-light leading-relaxed">
                            For mobile devices, rotate to <span className="text-white font-bold underline decoration-[#ff0055]">LANDSCAPE</span> for optimal combat visibility.
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-6 md:mt-10 flex flex-row gap-6 md:gap-10 w-full justify-center pb-8">
                <div className="flex-[1.2] max-w-[220px] md:max-w-[280px]">
                    <Button
                        variant="primary"
                        onClick={onPlay}
                        fullWidth
                    >
                        START
                    </Button>
                </div>
                <div className="flex-1 max-w-[150px] md:max-w-[180px]">
                    <Button
                        variant="secondary"
                        onClick={onBack}
                        fullWidth
                    >
                        RETURN
                    </Button>
                </div>
            </div>
        </div>
    );
};
