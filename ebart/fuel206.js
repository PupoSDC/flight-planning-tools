const perf = (t) => {
    const fuel = (22.03 - 20.9) / 30 * (t + 21) + 20.9
    const speed =  (136 - 130) / 30 * (t + 21) + 130
    return { fuel, speed };
}
// {fuel: 21.502666666666666, speed: 133.2}
