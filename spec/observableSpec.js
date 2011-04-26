describe('observable', function () {
  it('should use observable as a mixin', function () {
    var base = {}, result;
    
    result = observable(base);
    
    expect(result).toBe(base);
  });
  it('should use addEventListener method to add event listener', function () {
    var underTest = observable({}),
    listener = function () {};
    
    underTest.addEventListener(listener);
    
    expect(underTest.listeners()).toEqual([listener]);
  });
  it('should use dispatchEvent to invoke registered listener', function () {
    var underTest = observable({}),
    result,
    listener = function () {
      result = 'listenerInvoked';
    };
    underTest.addEventListener(listener);
    
    underTest.dispatchEvent('argument');
    
    expect(result).toBe('listenerInvoked');
  });
  //Same test, but using a Jasmine spy
  it('should use dispatchEvent to invoke registered listener', function () {
    var underTest = observable({}),
    listener = jasmine.createSpy();
    underTest.addEventListener(listener);
    underTest.dispatchEvent('argument');
    expect(listener).toHaveBeenCalledWith('argument');
  });
  it('should be able to add multiple listeners', function () {
    var underTest = observable({}),
    firstListener = jasmine.createSpy(),
    secondListener = jasmine.createSpy();
    underTest.addEventListener(firstListener);
    underTest.addEventListener(secondListener);
    
    underTest.dispatchEvent('argument');
    
    expect(firstListener).toHaveBeenCalledWith('argument');
    expect(secondListener).toHaveBeenCalledWith('argument');
  });
  it('should be able to add listener for an event type', function () {
    var underTest = observable({}),
    listenerOnTypeA = jasmine.createSpy(),
    listenerOnTypeB = jasmine.createSpy();
    underTest.addEventListener('TypeA', listenerOnTypeA);
    underTest.addEventListener('TypeB', listenerOnTypeB);
    
    underTest.dispatchEvent('TypeA', 'argument');
    
    expect(listenerOnTypeA).toHaveBeenCalledWith('argument');
    expect(listenerOnTypeB).not.toHaveBeenCalled();
  });
  it('should invoke all listeners, even if one of them throws an error', function () {
    var underTest = observable({}),
    badListener = jasmine.createSpy().andThrow('Error!'),
    goodListener = jasmine.createSpy();
    underTest.addEventListener('EventType', badListener);
    underTest.addEventListener('EventType', goodListener);
    
    underTest.dispatchEvent('EventType', 'argument');
    
    expect(badListener).toHaveBeenCalledWith('argument');
    expect(goodListener).toHaveBeenCalledWith('argument');
  });
  it('should be able to specify the order in which listeners are invoked, by setting priority', function () {
    var underTest = observable({}),
    lowPriorityListener = function () { result += 'first:'; },
    highPriorityListener = function () { result += 'second:'; },
    result = ':';
    underTest.addEventListener('EventType', lowPriorityListener, 1);
    underTest.addEventListener('EventType', highPriorityListener, 2);
    
    underTest.dispatchEvent('EventType', 'argument');
    
    expect(result).toBe(':second:first:');
  });
  it('should be able to cancel event propagation by returning false from event listener', function () {
    var underTest = observable({}),
    firstListener = jasmine.createSpy().andReturn(false),
    secondListener = jasmine.createSpy();
    underTest.addEventListener('EventType', firstListener);
    underTest.addEventListener('EventType', secondListener);
    underTest.dispatchEvent('EventType', 'argument');
    
    expect(firstListener).toHaveBeenCalledWith('argument');
    
    expect(secondListener).not.toHaveBeenCalled();
  });
});
