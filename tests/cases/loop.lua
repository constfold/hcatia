--[[
    All functions below using different loop types have the same job, returning the first `n` fibonacci numbers until
    a number greater than `m` is encountered.
]]

local function fib_forNum(n, m)
    local fibs = {1, 1}
    for i = 3, n do
        local fib = fibs[i - 1] + fibs[i - 2]
        if fib > m then
            break
        else
            fibs[i] = fib
        end
    end
    return fibs
end


local function range(from, to)
    return function (_, last)
        if last > to then return nil
        else return last + 1
        end
    end, nil, from - 1
end


local function fib_forIn(n, m)
    local fibs = {1, 1}
    for i in range(3, n) do
        local fib = fibs[i - 1] + fibs[i - 2]
        if fib > m then
            break
        else
            fibs[i] = fib
        end
    end
    return fibs
end

local function fib_while(n, m)
    local fibs = {1, 1}
    local i = 3
    while i <= n do
        local fib = fibs[i - 1] + fibs[i - 2]
        if fib > m then
            break
        else
            fibs[i] = fib
        end
        i = i + 1
    end
    return fibs
end

local function fib_repeat(n, m)
    local fibs = {1, 1}
    if n < 3 then return fibs end
    local i = 3
    repeat
        local fib = fibs[i - 1] + fibs[i - 2]
        if fib > m then
            break
        else
            fibs[i] = fib
        end
        i = i + 1
    until i > n
    return fibs
end
