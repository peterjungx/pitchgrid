import numpy as np

def find_affine_transform(a1, a2, a3, b1, b2, b3):
    # Construct the 6x6 matrix
    M = np.array([
        [a1[0], a1[1], 1, 0, 0, 0],
        [0, 0, 0, a1[0], a1[1], 1],
        [a2[0], a2[1], 1, 0, 0, 0],
        [0, 0, 0, a2[0], a2[1], 1],
        [a3[0], a3[1], 1, 0, 0, 0],
        [0, 0, 0, a3[0], a3[1], 1]
    ])
    
    # Target vector
    b = np.array([b1[0], b1[1], b2[0], b2[1], b3[0], b3[1]])
    
    # Solve the system
    sol = np.linalg.solve(M, b)
    
    # Extract 2x2 matrix and translation vector
    transform_matrix = np.array([[sol[0], sol[1]],
                                [sol[3], sol[4]]])
    translation = np.array([sol[2], sol[5]])
    
    return transform_matrix, translation


if __name__ == "__main__":
    a1 = [0, 0]
    b1 = [0, 0]

    a2 = [7, 12]
    b2 = [6*4, 0]

    a3 = [2, 4]
    b3 = [2*4, -3]
    
    M, d = find_affine_transform(a1, a2, a3, b1, b2, b3)
    print(M)

    # check result
    print(np.dot(M, a1) + d)
    print(b1)

    print(np.dot(M, a2) + d)
    print(b2)

    print(np.dot(M, a3) + d)
    print(b3)

